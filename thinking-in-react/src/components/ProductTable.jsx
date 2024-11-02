import ProductCategoryRow from "./ProductCategoryRow"
import ProductRow from "./ProductRow"


const ProductTable = () => {
  return (
    <table>
      <thead>
      <tr>
          <th>Name</th>
          <th>Price</th>
        
        </tr>
      </thead>
      
      <tbody>
      
        <ProductCategoryRow/>
        <ProductRow/>
      
      </tbody>
    </table>
  )
};

export default ProductTable;
