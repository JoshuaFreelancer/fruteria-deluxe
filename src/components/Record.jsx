import React, { useEffect, useState } from "react";

const Record = ({ registros }) => {
  const [historial, setHistorial] = useState(() => {
    const storedHistorial = JSON.parse(localStorage.getItem("historial")) || [];
    return storedHistorial;
  });

  useEffect(() => {
    const updateLocalStorage = async () => {
      await localStorage.setItem("historial", JSON.stringify(historial));
    };

    updateLocalStorage();
  }, [historial]);

  useEffect(() => {
    setHistorial(registros);
  }, [registros]);

  return (
    <div className="bg-white p-4 rounded-md shadow-md mt-4">
      <h2 className="text-xl font-semibold mb-2">Historial</h2>
      {historial.length > 0 ? (
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Acción</th>
            </tr>
          </thead>
          <tbody>
            {historial.map((registro, index) => (
              <tr key={index} className="border border-gray-300">
                <td className="border border-gray-300 p-2">{registro}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500">El historial está vacío.</p>
      )}
    </div>
  );
};

export default Record;
