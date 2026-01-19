from PIL import Image
import os

# Create directory
output_dir = "public/assets/avatars"
os.makedirs(output_dir, exist_ok=True)

# Load the generated image
# Note: In real scenarios, I'd move the artifact. For now, assuming the user will confirm path or I will mock it.
# Actually, I cannot access the artifact directly via this script easily in this env without exact path.
# I will assume the image is at a known temp location or I will use a placeholder generation for splitting if I can't reach it.
# Wait, I have the path: C:/Users/hatake/.gemini/antigravity/brain/3061ce3b-cfb2-4db7-8528-431a21317adf/pixel_avatars_set_1768788908784.png
# I need to copy it first.

source_path = r"C:\Users\hatake\.gemini\antigravity\brain\3061ce3b-cfb2-4db7-8528-431a21317adf\pixel_avatars_set_1768788908784.png"

try:
    img = Image.open(source_path)
    width, height = img.size
    
    # 2x2 Grid
    cell_w = width // 2
    cell_h = height // 2
    
    avatars = []
    avatars.append(img.crop((0, 0, cell_w, cell_h)))
    avatars.append(img.crop((cell_w, 0, width, cell_h)))
    avatars.append(img.crop((0, cell_h, cell_w, height)))
    avatars.append(img.crop((cell_w, cell_h, width, height)))
    
    for i, avatar in enumerate(avatars):
        output_path = os.path.join(output_dir, f"avatar_{i+1}.png")
        avatar.save(output_path)
        print(f"Saved {output_path}")

except Exception as e:
    print(f"Error: {e}")
