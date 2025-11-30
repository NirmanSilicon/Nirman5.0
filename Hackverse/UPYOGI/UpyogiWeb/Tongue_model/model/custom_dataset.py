# model/custom_dataset.py
from pathlib import Path
import pandas as pd
from PIL import Image
from torch.utils.data import Dataset


class TongueCSVData(Dataset):
    """
    Loads images & labels from a CSV like:
      filename,label
      1.bmp,Kapha
      2.bmp,Vata
      ...
    Images are expected in `images_dir/filename`.
    """

    def __init__(self, csv_path, images_dir, transform=None):
        self.images_dir = Path(images_dir)
        self.transform = transform

        df = pd.read_csv(csv_path)
        if "filename" not in df.columns or "label" not in df.columns:
            raise ValueError("CSV must have columns: filename,label")

        # Normalize labels to lowercase (kapha, vata, pitta)
        self.filenames = df["filename"].astype(str).tolist()
        self.labels = df["label"].astype(str).str.strip().str.lower().tolist()

        # Build label → index mapping
        classes = sorted(list(set(self.labels)))   # e.g. ['kapha', 'pitta', 'vata']
        self.class_to_idx = {label: idx for idx, label in enumerate(classes)}
        self.idx_to_class = {idx: label for label, idx in self.class_to_idx.items()}
        self.class_names = classes


        print("TongueCSVData classes:", self.class_names)
        print("Number of samples:", len(self.filenames))

    def __len__(self):
        return len(self.filenames)

    def __getitem__(self, idx):
        img_name = self.filenames[idx]
        label_name = self.labels[idx]
        label_idx = self.class_to_idx[label_name]

        img_path = self.images_dir / img_name
        # .bmp is supported by PIL
        image = Image.open(img_path).convert("RGB")

        if self.transform:
            image = self.transform(image)

        return image, label_idx
