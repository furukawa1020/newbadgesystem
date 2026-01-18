from PIL import Image
import os
import glob

def make_transparent(folder_path):
    # Process all pngs in folder
    for file_path in glob.glob(os.path.join(folder_path, '*.png')):
        try:
            img = Image.open(file_path).convert("RGBA")
            datas = img.getdata()
            
            new_data = []
            for item in datas:
                # Change all white (also shades of whites)
                if item[0] > 240 and item[1] > 240 and item[2] > 240:
                    new_data.append((255, 255, 255, 0))
                else:
                    new_data.append(item)
            
            img.putdata(new_data)
            img.save(file_path, "PNG")
            print(f"Processed {file_path}")
        except Exception as e:
            print(f"Failed {file_path}: {e}")

if __name__ == "__main__":
    make_transparent('./public/assets/badges')
