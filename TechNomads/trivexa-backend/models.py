import json
from sqlmodel import SQLModel, Field, create_engine, Session, select

class Medicine(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    disease_name: str = Field(default=None, nullable=False)
    disease_url: str | None = Field(default=None, nullable=True)
    med_name: str = Field(default=None, nullable=False)
    med_url: str | None = Field(default=None, nullable=True)
    final_price: str = Field(default=None, nullable=False)
    price: str = Field(default=None, nullable=False)
    prescription_required: str | None = Field(default=None, nullable=True)
    drug_variant: str | None = Field(default=None, nullable=True)
    drug_manufacturer: str | None = Field(default=None, nullable=True)
    drug_manufacturer_origin: str | None = Field(default=None, nullable=True)
    drug_content: str | None = Field(default=None, nullable=True)
    generic_name: str = Field(default=None, nullable=False)
    img_urls: str | None = Field(default=None, nullable=True)

engine = create_engine("sqlite:///database/medicines.db")
SQLModel.metadata.create_all(engine)

def search(search):
    res_container = []
    text = search.strip()
    with Session(engine) as session:
        results = session.exec(select(Medicine).where(
            (Medicine.disease_name.contains(text)) |
            (Medicine.med_name.contains(text)) |
            (Medicine.generic_name.contains(text)) |
            (Medicine.drug_variant.contains(text))
        )).all()
        
        for med in results:
            med_dict = med.model_dump()
            
            res_container.append(med_dict)
            
    print(f"Found {len(res_container)} results for '{search}'")
    return res_container
