import json
from pathlib import Path

class GlobalDAGBuilder:
    def __init__(self, syllabus_dir="./"):
        self.syllabus_dir = Path(syllabus_dir)
        self.dag = {} # {module_name: {subjects: [], levels: []}}

    def _recursive_scan(self, data, subject, level):
        if isinstance(data, dict):
            for k, v in data.items():
                if isinstance(v, list):
                    # Found a list of modules
                    for module in v:
                        m_key = str(module).lower().strip()
                        if m_key not in self.dag:
                            self.dag[m_key] = {"subjects": set(), "levels": set(), "original_name": module}
                        self.dag[m_key]["subjects"].add(subject)
                        self.dag[m_key]["levels"].add(level)
                else:
                    self._recursive_scan(v, subject, level)

    def scan_syllabi(self):
        """Scans all syllabus.json files to find overlapping modules."""
        for p in self.syllabus_dir.glob("*.json"):
            if p.name.startswith("syllabus"):
                with open(p, "r", encoding="utf-8") as f:
                    try:
                        data = json.load(f)
                        # Try to find subject/level from file name if not in data
                        subject = data.get("subject", p.stem.split("_")[1] if "_" in p.stem else "Unknown")
                        level = data.get("level", p.stem.split("_")[2] if "_" in p.stem else "Unknown")
                        self._recursive_scan(data, subject, level)
                    except Exception as e:
                        print(f"Error parsing {p}: {e}")

    def generate_report(self):
        print("--- Global DAG Report: Overlapping Modules ---")
        overlap_count = 0
        for m_key, info in self.dag.items():
            if len(info["subjects"]) > 1:
                overlap_count += 1
                print(f"[*] Shared Module: '{info['original_name']}'")
                print(f"    - Found in Subjects: {', '.join(info['subjects'])}")
                print(f"    - Found at Levels: {', '.join(info['levels'])}")
        
        print(f"\nTotal Unique Modules: {len(self.dag)}")
        print(f"Total Shared Modules: {overlap_count}")

if __name__ == "__main__":
    builder = GlobalDAGBuilder(syllabus_dir="c:/Silvere/Encours/Developpement/OpenPrimer/generator")
    builder.scan_syllabi()
    builder.generate_report()
