"""Small regression tests for the RDKit descriptor and enumeration logic."""
import unittest
from rdkit import Chem
from fastapi import HTTPException
from app import molecule_descriptors, EnumerationRequest, enumerate_substituents


class MolecularDesignTests(unittest.TestCase):
    def test_descriptor_values_are_present(self):
        result = molecule_descriptors("CCO")
        self.assertEqual(result["formula"], "C2H6O")
        self.assertGreater(result["molecular_weight"], 40)
        self.assertIn("qed", result)
        self.assertEqual(Chem.MolToSmiles(Chem.MolFromSmiles(result["smiles"])), result["smiles"])

    def test_invalid_smiles_is_rejected(self):
        with self.assertRaises(HTTPException):
            molecule_descriptors("not a smiles")

    def test_single_site_substitution(self):
        request = EnumerationRequest(
            core_smiles="c1cc([*])ccc1",
            substituents=["F", "Cl", "OC", "F"],
            max_results=20,
        )
        response = enumerate_substituents(request)
        self.assertEqual(response["count"], 3)
        self.assertEqual(len({r["smiles"] for r in response["results"]}), 3)
        self.assertTrue(all("formula" in row and "logp" in row for row in response["results"]))

    def test_scaffold_requires_one_attachment(self):
        request = EnumerationRequest(core_smiles="c1ccccc1", substituents=["F"])
        with self.assertRaises(HTTPException):
            enumerate_substituents(request)


if __name__ == "__main__":
    unittest.main()
