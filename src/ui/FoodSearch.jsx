import React, { useState, useEffect } from "react";
import { Form, Dropdown, Spinner, InputGroup } from "react-bootstrap";
import { searchFood } from "../services/foodAPI.js";

export default function FoodSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // debounce input
  useEffect(() => {
    if (!query) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await searchFood(query);
        setResults(data.foods?.slice(0, 10) || []); // limit to 10
        setShowDropdown(true);
      } catch (err) {
        console.error(err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div style={{ position: "relative", maxWidth: "400px" }}>
      <InputGroup>
        <Form.Control
          type="text"
          placeholder="Search food"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {loading && (
          <InputGroup.Text>
            <Spinner animation="border" size="sm" />
          </InputGroup.Text>
        )}
      </InputGroup>

      {showDropdown && results.length > 0 && (
        <Dropdown.Menu show style={{ width: "100%" }}>
          {results.map((item) => (
            <Dropdown.Item
              key={item.fdcId}
              onClick={() => {
                setQuery(item.description);
                setShowDropdown(false);
              }}
            >
              {item.description}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      )}
    </div>
  );
}
