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
    generic_name: str = Field(default=None, nullable=False)
    img_urls: str | None = Field(default=None, nullable=True)

engine = create_engine("sqlite:///database/medicines.db")
SQLModel.metadata.create_all(engine)

with Session(engine) as session:
    medicine = session.exec(select(Medicine).where(Medicine.id == 3)).first()
    if medicine:
        medicine_dict = medicine.model_dump()
        print(json.dumps(medicine_dict, indent=2))
    else:
        print("Medicine with id 3 not found.")
