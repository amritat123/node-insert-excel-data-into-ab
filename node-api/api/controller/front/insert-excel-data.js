const ProductModel = require("../../models/product");
const MarketModel = require("../../models/market");
const CalculationModel = require("../../models/calcuation");
const { ObjectId } = require("mongoose").Types;
const readXlsxFile = require("read-excel-file/node");

exports.insertExcelDataIntoMongo = async (req, res) => {
  try {
    const rows = await readXlsxFile(req.file.path);
    const productMessages = [];
    //Skip headers
    rows.shift();
    await Promise.all(
      rows.map(async (row) => {
        let newState;
        newState = {
          product: row[2],
          discount_band: `${row[3]}`,
          units_sold: row[4],
          manufacturing_price: row[5],
          sale_price: row[6],
          gross_sales: `${row[7]}`,
          discounts: row[8],
          sales: row[9],
          COGS: row[10],
          profit: row[11],
        };
        // Check if a record with the same link already exists in the database
        const existingRecord = await ProductModel.findOne({
          product: newState.product,
        });
        if (existingRecord) {
          productMessages.push(
            "This excel data already exists , You can't insert it again"
          );
        }
        let newProduct;
        if (!existingRecord) {
          newProduct = new ProductModel(newState);
          await newProduct.save();
        }

        let newObjState;
        newObjState = {
          segment: row[0],
          country: row[1],
        };
        // Create a new document and save it to the target collection
        const newDocument = new MarketModel(newObjState);
        await newDocument.save();

        const CalculationData = new CalculationModel({
          productId: newProduct._id,
          marketId: newDocument._id,
          year: row[15],
          date: row[12],
          month_number: row[13],
          month_name: row[14],
        });
        await CalculationData.save();
      })
    );
    return res.send({
      message: `File is uploaded successfully to the collection. Please wait for some time.`,
    });
  } catch (error) {
    console.log("error ", error);
    res.status(500).send({
      message: "Could not read the file: " + error,
    });
  }
};
