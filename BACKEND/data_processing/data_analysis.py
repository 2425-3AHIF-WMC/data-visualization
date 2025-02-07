# This file will contain the code for the data_processing analysis of the project.

import pandas as pd
import requests




# region 1. LOAD DATA
def load_data(file_path):
    """
    Loads data_processing based on data_processing ending automatically.
    Supporting formats: CSV, Excel, JSON
    """
    try:
        if file_path.endswith('.csv'):
            print(f"Loading CSV file: {file_path}")
            return pd.read_csv(file_path)
        elif file_path.endswith('.xlsx') or file_path.endswith('.xls'):
            print(f"Loading Excel file: {file_path}")
            return pd.read_excel(file_path)
        elif file_path.endswith('.json'):
            print(f"Loading JSON file: {file_path}")
            return pd.read_json(file_path)
        else:
            raise ValueError(f"File extension not supported for {file_path}.")
    except Exception as e:
        raise RuntimeError(f"Failed to load data_processing from {file_path}. Error: {e}")


def load_api_data(url):
    """
    loads data_processing from API (JSON-format expected).
    """
    response = requests.get(url)
    response.raise_for_status()
    return pd.DataFrame(response.json())


def load_data_auto(source):
    """
    loads automatically data_processing from a file or API.
    """
    if source.startswith('http://') or source.startswith('https://'):
        return load_api_data(source)
    elif source.endswith(('.csv', '.xlsx', '.json')):
        return load_data(source)
    else:
        raise ValueError("Unsupported source or file type")


# endregion


# region 2. CLEAN DATA

df = load_data('testJSON.json')

# remove duplicates based on 'ID' column
df.drop_duplicates(subset='ID', inplace=True)

# remove rows containing at least one missing value
df.dropna(axis=0, inplace=True)



# endregion


# region 3. ANALYSE DATA


#######

# endregion

# visualize data_processing
# save data_processing
