import json

with open('public/r/heartlink.json', 'r') as f:
    data = json.load(f)

existing_paths = {item['path'] for item in data['files']}

new_files = [
    {
        "path": "registry/default/blocks/heartlink/components/RadarFeed.tsx",
        "type": "registry:component",
        "target": "components/blocks/heartlink/components/RadarFeed.tsx"
    },
    {
        "path": "registry/default/blocks/heartlink/components/TrustScoreBadge.tsx",
        "type": "registry:component",
        "target": "components/blocks/heartlink/components/TrustScoreBadge.tsx"
    },
    {
        "path": "registry/default/blocks/heartlink/components/VibeReelsFeed.tsx",
        "type": "registry:component",
        "target": "components/blocks/heartlink/components/VibeReelsFeed.tsx"
    },
    {
        "path": "registry/default/blocks/heartlink/components/SpeedVideoDateModal.tsx",
        "type": "registry:component",
        "target": "components/blocks/heartlink/components/SpeedVideoDateModal.tsx"
    },
    {
        "path": "registry/default/blocks/heartlink/components/SafetyGuardianModal.tsx",
        "type": "registry:component",
        "target": "components/blocks/heartlink/components/SafetyGuardianModal.tsx"
    },
    {
        "path": "registry/default/blocks/heartlink/components/BlindDateFeed.tsx",
        "type": "registry:component",
        "target": "components/blocks/heartlink/components/BlindDateFeed.tsx"
    }
]

for nf in new_files:
    if nf['path'] not in existing_paths:
        data['files'].append(nf)
        print(f"Added {nf['path']}")

with open('public/r/heartlink.json', 'w') as f:
    json.dump(data, f, indent=2)
