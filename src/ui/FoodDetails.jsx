import React, { useState, useEffect } from "react";
import { Spinner, Table } from "react-bootstrap";
import {
  getFoodDetails,
  formatNutritionValue,
  getNutritionLabel,
  getNutritionUnit,
} from "../services/foodAPI.js";

export default function FoodDetails({ productId }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!productId) return;

    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getFoodDetails(productId);
        setDetails(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load food details");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [productId]);

  if (!productId) return <p>Select a food to see details.</p>;
  if (loading) return <Spinner animation="border" />;
  if (error) return <p>{error}</p>;
  if (!details) return null;

  // OpenFoodFacts returns nutrients in an array → we map to your label/unit helpers
  return (
    <div style={{ marginTop: "1rem" }}>
      <h4>{details.description}</h4>
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>Nutrient</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {details.foodNutrients?.map((nutrient) => {
            const name = getNutritionLabel(nutrient.nutrientName?.toLowerCase());
            const unit = getNutritionUnit(nutrient.nutrientName?.toLowerCase());
            return (
              <tr key={nutrient.nutrientId}>
                <td>{name}</td>
                <td>
                  {formatNutritionValue(nutrient.value, unit)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
}
