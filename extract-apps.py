import os
import shutil
import re
import json

SOURCE_DIR = "/home/nitishyadav/.gemini/antigravity/scratch/shadcn-mcp-app"
TARGET_DIR = "/home/nitishyadav/.gemini/antigravity/scratch/standalone-apps"

COMPONENTS = [
    {"name": "popout-card", "id": "profile-preview-card"},
    {"name": "full-modal", "id": "user-profile-card"},
    {"name": "settings-dashboard", "id": "feature-management-card"},
    {"name": "server-profile-card", "id": "server-profile-card"},
    {"name": "voice-call-overlay", "id": "voice-call-member-card"},
    {"name": "nitro-subscription-pricing", "id": "nitro-subscription-pricing"},
    {"name": "chats-list-card", "id": "chat-list-card"},
    {"name": "social-post-card", "id": "social-post-card"},
    {"name": "pricing-table", "id": "pricing-table"},
    {"name": "discord-sidebar-nav", "id": "discord-sidebar-nav"},
    {"name": "spatial-carousel", "id": "spatial-carousel"}
]

def copy_ignore(path, names):
    return [n for n in names if n in ['node_modules', '.git', 'dist', '.tempmediaStorage', '.agents']]

def main():
    if os.path.exists(TARGET_DIR):
        shutil.rmtree(TARGET_DIR)
    os.makedirs(TARGET_DIR)
    
    # Create workspace package.json
    workspace_pkg = {
        "name": "standalone-components",
        "private": True,
        "workspaces": ["*"]
    }
    with open(os.path.join(TARGET_DIR, "package.json"), "w") as f:
        json.dump(workspace_pkg, f, indent=2)
    
    with open(os.path.join(SOURCE_DIR, "src/App.tsx"), "r") as f:
        app_code = f.read()
    
    port = 5174
    for comp in COMPONENTS:
        app_name = comp["name"]
        comp_id = comp["id"]
        print(f"Creating {app_name}...")
        
        app_dir = os.path.join(TARGET_DIR, app_name)
        shutil.copytree(SOURCE_DIR, app_dir, ignore=copy_ignore)
        
        # 1. Update package.json name
        pkg_path = os.path.join(app_dir, "package.json")
        with open(pkg_path, "r") as f:
            pkg = json.load(f)
        pkg["name"] = f"@{app_name}/app"
        with open(pkg_path, "w") as f:
            json.dump(pkg, f, indent=2)
            
        # 2. Update vite.config.ts port
        vite_path = os.path.join(app_dir, "vite.config.ts")
        if os.path.exists(vite_path):
            with open(vite_path, "r") as f:
                vite_code = f.read()
            if "server: {" not in vite_code:
                vite_code = vite_code.replace("plugins:", f"server: {{ port: {port} }},\n  plugins:")
                with open(vite_path, "w") as f:
                    f.write(vite_code)
        port += 1
        
        # 3. Modify App.tsx to only show this component
        # Set default activeComponent
        modified_app = re.sub(r"useState<'[^>]+'>\('[^']+'\)", f"useState<any>('{comp_id}')", app_code)
        # Remove Header
        modified_app = re.sub(r"<header.*?</header>", "", modified_app, flags=re.DOTALL)
        # Remove Catalog Tab button bar
        modified_app = re.sub(r'<div className="bg-purple-50.*?</div>\s*</div>', "", modified_app, flags=re.DOTALL)
        # Remove activeTab condition so it always renders preview
        modified_app = modified_app.replace("{activeTab === 'preview' && (", "")
        # Remove the closing brace for that condition (we'll just remove all other tabs)
        modified_app = re.sub(r"\{activeTab === 'catalog'.*", "</main>\n    </div>\n  );\n}", modified_app, flags=re.DOTALL)
        
        with open(os.path.join(app_dir, "src/App.tsx"), "w") as f:
            f.write(modified_app)

if __name__ == "__main__":
    main()
