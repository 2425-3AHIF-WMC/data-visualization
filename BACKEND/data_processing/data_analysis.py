import pandas as pd
import requests
import logging
from sqlalchemy import create_engine

# Logging konfigurieren
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")


# region 1. LOAD DATA
def load_data(file_path):
    """
    Lädt Daten basierend auf der Dateierweiterung.
    Unterstützt: CSV, Excel, JSON
    """
    try:
        if file_path.endswith('.csv'):
            logging.info(f"Loading CSV file: {file_path}")
            return pd.read_csv(file_path)
        elif file_path.endswith(('.xlsx', '.xls')):
            logging.info(f"Loading Excel file: {file_path}")
            return pd.read_excel(file_path)
        elif file_path.endswith('.json'):
            logging.info(f"Loading JSON file: {file_path}")
            return pd.read_json(file_path)
        else:
            raise ValueError(f"File extension not supported for {file_path}.")
    except Exception as e:
        logging.error(f"Failed to load data from {file_path}. Error: {e}")
        raise


def load_api_data(url):
    """
    Lädt JSON-Daten von einer API.
    """
    try:
        response = requests.get(url)
        response.raise_for_status()
        logging.info(f"Loading data from API: {url}")
        return pd.DataFrame(response.json())
    except Exception as e:
        logging.error(f"Failed to load data from API. Error: {e}")
        raise


def load_data_auto(source):
    """
    Automatische Datenquelle erkennen und laden.
    """
    if source.startswith('http://') or source.startswith('https://'):
        return load_api_data(source)
    elif source.endswith(('.csv', '.xlsx', '.json')):
        return load_data(source)
    else:
        raise ValueError("Unsupported source or file type")


# endregion

# region 2. CLEAN DATA
def clean_data(df):
    """
    Bereinigt das DataFrame durch:
    - Entfernen von Duplikaten
    - Behandeln fehlender Werte
    - Standardisieren von Spaltennamen
    """
    logging.info("Cleaning data...")

    # Standardisieren von Spaltennamen
    df.columns = df.columns.str.strip().str.lower().str.replace(' ', '_')

    # Entfernen von Duplikaten basierend auf 'id' (falls vorhanden)
    if 'id' in df.columns:
        before = len(df)
        df.drop_duplicates(subset='id', inplace=True)
        after = len(df)
        logging.info(f"Removed {before - after} duplicate rows based on 'id' column.")

    # Fehlende Werte auffüllen
    for col in df.select_dtypes(include=['number']).columns:
        df[col].fillna(df[col].median(), inplace=True)
    for col in df.select_dtypes(include=['object']).columns:
        df[col].fillna('Unknown', inplace=True)

    logging.info(f"Remaining missing values: {df.isnull().sum().sum()}")

    return df


# endregion

# region 3. SAVE DATA
def save_data(df, db_path="database.db"):
    """
    Speichert die bereinigten Daten in eine SQL-Datenbank.
    """
    logging.info("Saving data to database...")

    engine = create_engine(f"sqlite:///{db_path}")
    df.to_sql("cleaned_data", engine, if_exists="replace", index=False)
    logging.info(f"Data saved to SQL database: {db_path}")


# endregion

# Testlauf
df = load_data('testJSON.json')
df = clean_data(df)
save_data(df)
