import os
import zipfile

def make_zip(output_filename, source_dir):
    exclude_dirs = {'node_modules', 'dist', '.git', '.aistudio', '__pycache__'}
    exclude_files = {output_filename, 'smartprocure-source-code.zip'}

    with zipfile.ZipFile(output_filename, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(source_dir):
            # Prune excluded directories
            dirs[:] = [d for d in dirs if d not in exclude_dirs and not d.startswith('.')]
            for file in files:
                if file in exclude_files or file.endswith('.zip'):
                    continue
                file_path = os.path.join(root, file)
                rel_path = os.path.relpath(file_path, source_dir)
                zipf.write(file_path, rel_path)

if __name__ == '__main__':
    make_zip('public/smartprocure-codebase.zip', '.')
    print('Zip archive created successfully: public/smartprocure-codebase.zip')
