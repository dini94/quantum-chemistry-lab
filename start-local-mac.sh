#!/usr/bin/env bash
# Robust macOS launcher for the local Quantum Chemistry Studio website + RDKit API.
set -o pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PUBLIC_DIR="$ROOT/public"
BACKEND_DIR="$ROOT/backend"
LOG_DIR="${TMPDIR:-/tmp}/quantum-chemistry-studio"
API_PORT="${QCS_API_PORT:-8765}"
WEB_PORT="${QCS_WEB_PORT:-8000}"
API_URL="http://127.0.0.1:$API_PORT"
WEB_URL="http://127.0.0.1:$WEB_PORT/rdkit-workbench.html"
mkdir -p "$LOG_DIR"
API_LOG="$LOG_DIR/backend.log"
WEB_LOG="$LOG_DIR/website.log"
API_PID=""
WEB_PID=""

fail() {
  printf '\nERROR: %s\n' "$*" >&2
  printf 'Log backend : %s\nLog website : %s\n' "$API_LOG" "$WEB_LOG" >&2
  exit 1
}

cleanup() {
  if [[ -n "${API_PID:-}" ]]; then kill "$API_PID" 2>/dev/null || true; fi
  if [[ -n "${WEB_PID:-}" ]]; then kill "$WEB_PID" 2>/dev/null || true; fi
}
trap cleanup EXIT INT TERM

[[ -f "$PUBLIC_DIR/rdkit-workbench.html" ]] || fail "File public/rdkit-workbench.html tidak ditemukan. Jalankan script dari folder repository yang benar."
[[ -f "$BACKEND_DIR/app.py" ]] || fail "File backend/app.py tidak ditemukan. Repository tidak lengkap."

# Prefer the currently active Python, then common Anaconda/Miniforge interpreters.
CANDIDATES=()
add_candidate() {
  local p="$1"
  [[ -n "$p" && -x "$p" ]] || return 0
  for existing in "${CANDIDATES[@]}"; do [[ "$existing" == "$p" ]] && return 0; done
  CANDIDATES+=("$p")
}
add_candidate "${PYTHON:-}"
add_candidate "${CONDA_PREFIX:-}/bin/python"
add_candidate "$(command -v python 2>/dev/null || true)"
add_candidate "$(command -v python3 2>/dev/null || true)"
CONDA_BASE="$(conda info --base 2>/dev/null || true)"
add_candidate "${CONDA_BASE:+$CONDA_BASE/bin/python}"

PYTHON_BIN=""
for candidate in "${CANDIDATES[@]}"; do
  if "$candidate" -c 'import rdkit' >/dev/null 2>&1; then
    PYTHON_BIN="$candidate"
    break
  fi
done

if [[ -z "$PYTHON_BIN" ]]; then
  printf 'Tidak menemukan Python yang dapat mengimpor RDKit.\n'
  printf 'Python yang diperiksa:\n'
  for candidate in "${CANDIDATES[@]}"; do printf '  - %s\n' "$candidate"; done
  printf '\nAktifkan environment Anaconda yang berisi RDKit, lalu jalankan ulang.\n'
  printf 'Contoh: conda activate base\n'
  fail "RDKit tidak tersedia pada interpreter yang ditemukan."
fi

printf 'Python aktif: %s\n' "$PYTHON_BIN"
"$PYTHON_BIN" -c 'import sys,rdkit; print("Python:",sys.version.split()[0]); print("RDKit:",rdkit.__version__)'

# Install only the service dependencies if they are missing; preserve the existing RDKit install.
if ! "$PYTHON_BIN" -c 'import fastapi, uvicorn, ase' >/dev/null 2>&1; then
  echo "Memasang dependensi FastAPI/Uvicorn/ASE ke environment Python terpilih..."
  "$PYTHON_BIN" -m pip install 'fastapi>=0.110' 'uvicorn[standard]>=0.27' 'ase>=3.23' || fail "Instalasi dependensi gagal. Lihat pesan pip di atas."
fi
"$PYTHON_BIN" -c 'import fastapi,uvicorn,ase,rdkit' || fail "Masih ada dependensi yang tidak dapat diimpor."

# Do not silently connect to an unrelated service or terminate a user's existing server.
for port in "$API_PORT" "$WEB_PORT"; do
  if lsof -nP -iTCP:"$port" -sTCP:LISTEN >/dev/null 2>&1; then
    fail "Port $port sudah dipakai. Tutup proses yang memakai port ini, atau jalankan dengan port alternatif, misalnya QCS_API_PORT=8766 QCS_WEB_PORT=8001 bash start-local-mac.sh."
  fi
done

: > "$API_LOG"
: > "$WEB_LOG"
(cd "$BACKEND_DIR" && exec "$PYTHON_BIN" -m uvicorn app:app --host 127.0.0.1 --port "$API_PORT" --log-level info) >>"$API_LOG" 2>&1 &
API_PID=$!
(cd "$PUBLIC_DIR" && exec "$PYTHON_BIN" -m http.server "$WEB_PORT" --bind 127.0.0.1) >>"$WEB_LOG" 2>&1 &
WEB_PID=$!

api_ready=0
web_ready=0
for attempt in {1..30}; do
  if [[ "$api_ready" -eq 0 ]] && curl --silent --show-error --fail "$API_URL/api/health" >/dev/null 2>&1; then api_ready=1; fi
  if [[ "$web_ready" -eq 0 ]] && curl --silent --show-error --fail "http://127.0.0.1:$WEB_PORT/rdkit-workbench.html" >/dev/null 2>&1; then web_ready=1; fi
  if [[ "$api_ready" -eq 1 && "$web_ready" -eq 1 ]]; then break; fi
  if ! kill -0 "$API_PID" 2>/dev/null; then
    echo "Backend berhenti saat startup. Log terakhir:"
    tail -40 "$API_LOG" 2>/dev/null || true
    fail "Backend gagal dijalankan."
  fi
  if ! kill -0 "$WEB_PID" 2>/dev/null; then
    echo "Website server berhenti saat startup. Log terakhir:"
    tail -40 "$WEB_LOG" 2>/dev/null || true
    fail "Website server gagal dijalankan."
  fi
  sleep 1
done

if [[ "$api_ready" -ne 1 || "$web_ready" -ne 1 ]]; then
  echo "Backend log:"; tail -40 "$API_LOG" 2>/dev/null || true
  echo "Website log:"; tail -40 "$WEB_LOG" 2>/dev/null || true
  fail "Server tidak lulus health check dalam 30 detik."
fi

echo
echo "SUCCESS: kedua service siap."
echo "Website : $WEB_URL"
echo "API     : $API_URL/api/health"
echo "Log     : $LOG_DIR"
echo "Tes API : $(curl --silent --fail "$API_URL/api/health")"
echo "Biarkan Terminal ini tetap terbuka. Tekan Ctrl+C untuk menghentikan service."
echo
open "$WEB_URL" 2>/dev/null || echo "Browser tidak terbuka otomatis; salin URL Website di atas."
# wait only for the child servers; exit when either unexpectedly dies.
while kill -0 "$API_PID" 2>/dev/null && kill -0 "$WEB_PID" 2>/dev/null; do sleep 2; done
echo "Salah satu server berhenti. Log backend/website ada di $LOG_DIR."
tail -30 "$API_LOG" 2>/dev/null || true
tail -30 "$WEB_LOG" 2>/dev/null || true
exit 1
