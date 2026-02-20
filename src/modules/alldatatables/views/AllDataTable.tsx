import CollapsibleTable from '../components/CollapisbleTable';
import CustomizationTable from '../components/CustomizationTable';
import SortingTable from '../components/SortingTable';
import Sticky from '../components/Sticky';

export function AllDataTablePage() {
  return (
    <div>
      <h3>Sticky Table</h3>
      <Sticky />
      <h3>Sorting Table</h3>
      <SortingTable />
      <h3>Customization Table</h3>
      <CustomizationTable />
      <h3>Collapsible table</h3>
      <CollapsibleTable />
    </div>
  );
}
