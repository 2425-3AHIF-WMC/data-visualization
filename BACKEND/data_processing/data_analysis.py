# This file contains the code for data processing and analysis of the project.

import pandas as pd
import requests
from sqlalchemy import create_engine


# region 1. LOAD DATA
def load_data(file_path):
    """
    Loads data based on file extension automatically.
    Supporting formats: CSV, Excel, JSON
    """
    try:
        if file_path.endswith('.csv'):
            print(f"Loading CSV file: {file_path}")
            return pd.read_csv(file_path)
        elif file_path.endswith(('.xlsx', '.xls')):
            print(f"Loading Excel file: {file_path}")
            return pd.read_excel(file_path)
        elif file_path.endswith('.json'):
            print(f"Loading JSON file: {file_path}")
            return pd.read_json(file_path)
        else:
            raise ValueError(f"File extension not supported for {file_path}.")
    except Exception as e:
        raise RuntimeError(f"Failed to load data from {file_path}. Error: {e}")


def load_api_data(url):
    """
    Loads data from API (JSON format expected).
    """
    try:
        response = requests.get(url)
        response.raise_for_status()
        print(f"Loading data from API: {url}")
        return pd.DataFrame(response.json())
    except Exception as e:
        raise RuntimeError(f"Failed to load data from API. Error: {e}")


def load_data_auto(source):
    """
    Loads data automatically from a file or API.
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
    Cleans the dataframe by removing duplicates, handling missing values, and standardizing column names.
    """
    print("Cleaning data...")

    # Standardize column names (lowercase & no spaces)
    df.columns = df.columns.str.strip().str.lower().str.replace(' ', '_')

    # Remove duplicates based on 'id' column (if exists)
    if 'id' in df.columns:
        before = len(df)
        df.drop_duplicates(subset='id', inplace=True)
        after = len(df)
        print(f"Removed {before - after} duplicate rows based on 'id' column.")

    # Remove rows containing at least one missing value
    missing_before = df.isnull().sum().sum()
    df.dropna(axis=0, inplace=True)
    missing_after = df.isnull().sum().sum()
    print(f"Removed {missing_before - missing_after} rows with missing values.")

    return df


# Load test data
df = load_data('testJSON.json')

# Clean data
df = clean_data(df)


# endregion


# region 3. ANALYSE DATA

def analyze_data(df):
    """
    Performs Exploratory Data Analysis (EDA) on the dataset.
    """
    print("\n--- DATA ANALYSIS ---\n")

    print("Shape of dataset:", df.shape)
    print("\nColumn Info:\n", df.info())
    print("\nMissing Values:\n", df.isnull().sum())
    print("\nSummary Statistics:\n", df.describe())

    # Correlation matrix (useful for numerical data)
    if df.select_dtypes(include=['number']).shape[1] > 1:
        print("\nCorrelation Matrix:\n", df.corr())


# Perform analysis
analyze_data(df)


# endregion


# region 4. SAVE DATA

def save_data(df, csv_path="cleaned_data.csv", db_path="database.db"):
    """
    Saves cleaned data to CSV and SQL database.
    """
    print("\nSaving data...")

    # Save to CSV
    df.to_csv(csv_path, index=False)
    print(f"Data saved to CSV: {csv_path}")

    # Save to SQL
    engine = create_engine(f"sqlite:///{db_path}")
    df.to_sql("cleaned_data", engine, if_exists="replace", index=False)
    print(f"Data saved to SQL database: {db_path}")


# Save cleaned data
save_data(df)

# endregion
