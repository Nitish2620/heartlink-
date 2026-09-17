import json
import os

def inject(filename):
    with open(filename, 'r') as f:
        data = json.load(f)
    
    for item in data.get('files', []):
        path = item.get('path')
        if path and os.path.exists(path):
            with open(path, 'r', encoding='utf-8') as src:
                item['content'] = src.read()
                print(f"Injected {path} into {filename}")
        else:
            print(f"Warning: {path} not found for {filename}")
            
    with open(filename, 'w') as f:
        json.dump(data, f, indent=2)

inject('public/r/heartlink.json')
inject('public/r/radar-feed.json')
print("Done.")
