import os
import re

def fix_imports(directory):
    patterns = [
        (r"from (['\"])(?:\.\./)+(context|components|types|services|pages|utils)", r"from \1@/\2"),
        (r"import (['\"])(?:\.\./)+(context|components|types|services|pages|utils)", r"import \1@/\2"), # For side-effect imports if any
        (r"from (['\"])(?:\.\./)+App", r"from \1@/App"), # Fix App import if referenced from deep
    ]

    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(('.ts', '.tsx', '.js', '.jsx')):
                filepath = os.path.join(root, file)
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                original_content = content
                for pattern, replacement in patterns:
                    content = re.sub(pattern, replacement, content)
                
                if content != original_content:
                    print(f"Fixing imports in {filepath}")
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(content)

if __name__ == "__main__":
    fix_imports("src")
