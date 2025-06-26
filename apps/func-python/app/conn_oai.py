\
# filepath: c:\\PIDS\\SGTA\\apps\\func-python\\app\\conn_oai.py
from sickle import Sickle
from sickle.oaiexceptions import NoRecordsMatch
import logging
from typing import List, Dict, Optional, Any, Iterator

logger = logging.getLogger(__name__)

class OAIQueryTool:
    """
    Tool for querying OAI-PMH compliant repositories.
    """
    def __init__(self, oai_base_url: str):
        """
        Initialize OAIQueryTool.

        Args:
            oai_base_url: The base URL of the OAI-PMH endpoint (e.g., "https://tesis.pucp.edu.pe/oai/request").
        """
        if not oai_base_url:
            raise ValueError("OAI base URL cannot be empty.")
        self.oai_base_url = oai_base_url
        try:
            self.sickle = Sickle(self.oai_base_url, max_retries=3, timeout=30)
            logger.info(f"OAIQueryTool initialized with endpoint: {self.oai_base_url}")
        except Exception as e:
            logger.error(f"Failed to initialize Sickle with endpoint {self.oai_base_url}: {e}")
            raise ConnectionError(f"Could not connect to OAI endpoint {self.oai_base_url}: {e}") from e

    def list_sets(self) -> List[Dict[str, str]]:
        """
        Lists all sets available in the repository.
        OAI-PMH sets often correspond to DSpace Collections.
        """
        try:
            sets_iterator = self.sickle.ListSets()
            sets_list = [{"setSpec": s.setSpec, "setName": s.setName} for s in sets_iterator]
            logger.info(f"Retrieved {len(sets_list)} sets from {self.oai_base_url}.")
            return sets_list
        except Exception as e:
            logger.error(f"Error listing sets from {self.oai_base_url}: {e}", exc_info=True)
            return []

    def list_records(self, metadata_prefix: str = 'oai_dc', set_spec: Optional[str] = None, 
                    limit: Optional[int] = None, offset: Optional[int] = None) -> Iterator[Dict[str, Any]]:
        """
        Lists records from the repository, optionally filtered by set with pagination support.

        Args:
            metadata_prefix: The metadata prefix to use (e.g., 'oai_dc').
            set_spec: The setSpec of the set to harvest records from. If None, harvests from all sets.
            limit: Maximum number of records to return. If None, returns all records.
            offset: Number of records to skip before starting to return records. If None, starts from 0.

        Yields:
            Dict: A dictionary representing a single record's header and metadata.
        """
        try:
            logger.info(f"Listing records with prefix '{metadata_prefix}'{f' for set {set_spec}' if set_spec else ''} (limit: {limit}, offset: {offset})...")
            records_iterator = self.sickle.ListRecords(metadataPrefix=metadata_prefix, set=set_spec, ignore_deleted=True)
            count = 0
            yielded = 0
            start_offset = offset or 0
            max_records = limit
            
            for record in records_iterator:
                # Skip records until we reach the offset
                if count < start_offset:
                    count += 1
                    continue
                
                # Stop if we've reached the limit
                if max_records is not None and yielded >= max_records:
                    break
                
                count += 1
                yielded += 1
                
                # The record object from Sickle has 'header' and 'metadata' attributes.
                # record.header is an XML element. record.metadata is a dict.
                # We need to extract relevant info from the header, like the identifier.
                # And the metadata itself is already a dictionary.
                yield {
                    "header": {
                        "identifier": record.header.identifier,
                        "datestamp": record.header.datestamp,
                        "setSpecs": [s for s in record.header.setSpecs], # Convert setSpecs to list
                    },
                    "metadata": record.metadata
                }
            
            logger.info(f"Finished listing {yielded} records (total processed: {count}) with prefix '{metadata_prefix}'{f' for set {set_spec}' if set_spec else ''}.")
        except NoRecordsMatch:
            logger.info(f"No records match for prefix '{metadata_prefix}'{f' in set {set_spec}' if set_spec else ''}.")
            # Yield nothing explicitly, or could return an empty iterator: yield from ()
        except Exception as e:
            logger.error(f"Error listing records from {self.oai_base_url} (prefix: {metadata_prefix}, set: {set_spec}): {e}", exc_info=True)
            # Yield nothing in case of other errors

    def get_record(self, identifier: str, metadata_prefix: str = 'oai_dc') -> Optional[Dict[str, Any]]:
        """
        Retrieves a single record by its OAI identifier.

        Args:
            identifier: The OAI identifier of the record.
            metadata_prefix: The metadata prefix.

        Returns:
            A dictionary with the record's header and metadata, or None if not found or error.
        """
        try:
            logger.info(f"Getting record by identifier: {identifier} with prefix '{metadata_prefix}'")
            record = self.sickle.GetRecord(identifier=identifier, metadataPrefix=metadata_prefix)
            return {
                "header": {
                    "identifier": record.header.identifier,
                    "datestamp": record.header.datestamp,
                    "setSpecs": [s for s in record.header.setSpecs],
                },
                "metadata": record.metadata
            }
        except Exception as e:
            logger.error(f"Error getting record {identifier} from {self.oai_base_url}: {e}", exc_info=True)
            return None

    def count_records(self, metadata_prefix: str = 'oai_dc', set_spec: Optional[str] = None) -> int:
        """
        Counts the total number of records in a set (or all sets if set_spec is None).
        
        Note: This requires iterating through all records, so it may be slow for large sets.
        Consider caching the result for better performance.
        
        Args:
            metadata_prefix: The metadata prefix to use (e.g., 'oai_dc').
            set_spec: The setSpec of the set to count records from. If None, counts from all sets.
            
        Returns:
            int: Total number of records available.
        """
        try:
            logger.info(f"Counting records with prefix '{metadata_prefix}'{f' for set {set_spec}' if set_spec else ''}...")
            records_iterator = self.sickle.ListRecords(metadataPrefix=metadata_prefix, set=set_spec, ignore_deleted=True)
            count = sum(1 for _ in records_iterator)
            logger.info(f"Total records count: {count}")
            return count
        except NoRecordsMatch:
            logger.info(f"No records match for prefix '{metadata_prefix}'{f' in set {set_spec}' if set_spec else ''}.")
            return 0
        except Exception as e:
            logger.error(f"Error counting records from {self.oai_base_url} (prefix: {metadata_prefix}, set: {set_spec}): {e}", exc_info=True)
            return 0

# Example Usage (for testing purposes)
if __name__ == '__main__':
    logging.basicConfig(level=logging.INFO)
    # Example for PUCP
    # oai_tool = OAIQueryTool(oai_base_url='https://tesis.pucp.edu.pe/oai/request')
    # Example for another DSpace instance (replace with a working one if needed for testing)
    oai_tool = OAIQueryTool(oai_base_url='https://dspace.mit.edu/oai/request')


    print("\\n--- Listing Sets ---")
    sets = oai_tool.list_sets()
    if sets:
        for s in sets[:5]: # Print first 5 sets
            print(f"Set Name: {s['setName']}, Set Spec: {s['setSpec']}")
    else:
        print("No sets found or error listing sets.")

    print("\\n--- Listing Records from the first set (if available) ---")
    if sets:
        first_set_spec = sets[0]['setSpec']
        print(f"Attempting to list records for set: {first_set_spec}")
        records_iterator = oai_tool.list_records(set_spec=first_set_spec)
        try:
            for i, record_data in enumerate(records_iterator):
                if i < 2: # Print first 2 records from the set
                    print(f"Record Identifier: {record_data['header']['identifier']}")
                    # Sickle's oai_dc parser usually makes titles a list
                    title = record_data['metadata'].get('title', ['No Title'])[0]
                    print(f"Title: {title}")
                else:
                    break
            if i == 0 and not record_data: # Check if iterator was empty
                 print(f"No records found in set {first_set_spec}.")

        except StopIteration:
            print(f"No records found in set {first_set_spec}.")
        except Exception as e:
            print(f"Error iterating records: {e}")
    else:
        print("Skipping record listing as no sets were found.")

    print("\\n--- Getting a specific record (example identifier, replace if needed) ---")
    # This identifier needs to be valid for the chosen OAI endpoint
    # For dspace.mit.edu, an example: 'oai:dspace.mit.edu:1721.1/75291'
    # For tesis.pucp.edu.pe, an example: 'oai:tesis.pucp.edu.pe:20.500.12404/1' (this might change)
    test_identifier = 'oai:dspace.mit.edu:1721.1/75291' # Adjust if using a different endpoint
    if sets: # Try to get a record from the first set if identifier is not known
        records_iterator_for_id = oai_tool.list_records(set_spec=sets[0]['setSpec'])
        try:
            first_record_for_id = next(records_iterator_for_id)
            test_identifier = first_record_for_id['header']['identifier']
            print(f"Using identifier from first set for GetRecord test: {test_identifier}")
        except StopIteration:
            print("Could not get a sample identifier from the first set.")
            test_identifier = None # Ensure it's None if not found

    if test_identifier:
        specific_record = oai_tool.get_record(identifier=test_identifier)
        if specific_record:
            title = specific_record['metadata'].get('title', ['No Title'])[0]
            print(f"Specific Record Identifier: {specific_record['header']['identifier']}, Title: {title}")
        else:
            print(f"Could not retrieve record with identifier: {test_identifier}")
    else:
        print("Skipping GetRecord test as no sample identifier was available.")

