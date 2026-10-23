#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PYTHON="${PYTHON:-python3}"

if ! "$PYTHON" -c "import fastapi, uvicorn, rdkit, ase" >/dev/null 2>&1; then
  echo "Python environment belum memiliki FastAPI, Uvicorn, RDKit, dan ASE."
  echo "Aktifkan environment Anaconda yang memiliki RDKit, lalu jalankan:"
  echo "  \"$PYTHON\" -m pip install -r \"$ROOT/backend/requirements.txt\""
  exit 1
fi

if lsof -nP -iTCP:8765 -sTCP:LISTEN >/dev/null 2>&1; then
  echo "Port 8765 sudah digunakan. Matikan service tersebut atau ubah port pada script dan halaman."
  exit 1
fi
if lsof -nP -iTCP:8000 -sTCP:LISTEN >/dev/null 2>&1; then
  echo "Port 8000 sudah digunakan. Tutup server di port tersebut atau ubah port pada script."
  exit 1
fi

cleanup() {
  [[ -n "${API_PID:-}" ]] && kill "$API_PID" 2>/dev/null || true
  [[ -n "${WEB_PID:-}" ]] && kill "$WEB_PID" 2>/dev/null || true
}
trap cleanup EXIT INT TERM

(cd "$ROOT/backend" && "$PYTHON" -m uvicorn app:app --host 127.0.0.1 --port 8765) &
API_PID=$!
(cd "$ROOT/public" && "$PYTHON" -m http.server 8000 --bind 127.0.0.1) &
WEB_PID=$!

echo
echo "Quantum Chemistry Studio berjalan:"
echo "  Website : http://localhost:8000/rdkit-workbench.html"
echo "  Backend : http://127.0.0.1:8765/api/health"
echo "Tekan Ctrl+C untuk menghentikan keduanya."
echo
sleep 2
open "http://localhost:8000/rdkit-workbench.html" 2>/dev/null || true
wait
