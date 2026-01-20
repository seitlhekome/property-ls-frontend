import React from 'react';

const PropertyList = ({ properties, toggleFav, favorites, fmt, activeTab, setSelectedProperty, deleteProp, currentUser }) => {
  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.length === 0 && (
        <p className="col-span-full text-center text-gray-500 mt-6">No properties found.</p>
      )}

      {properties.map((prop) => (
        <div key={prop.id} className="border rounded shadow hover:shadow-lg transition relative bg-white">
          {/* Favorite */}
          <button
            onClick={() => toggleFav(prop.id)}
            className={`absolute top-2 right-2 text-xl ${favorites.includes(prop.id) ? 'text-red-500' : 'text-gray-400'}`}
          >
            ♥
          </button>

          {/* Property Image */}
          {prop.images[0] && (
            <img
              src={prop.images[0]}
              alt={prop.title}
              className="w-full h-48 object-cover rounded-t cursor-pointer"
              onClick={() => setSelectedProperty(prop)}
            />
          )}

          <div className="p-4">
            <h3 className="font-bold text-lg cursor-pointer" onClick={() => setSelectedProperty(prop)}>
              {prop.title}
            </h3>
            <p className="text-gray-600">{prop.type} - {prop.district}</p>
            <p className="mt-1 font-semibold">
              {activeTab === 'buy' ? fmt(prop.price) : prop.rentPrice ? fmt(prop.rentPrice) + '/mo' : 'N/A'}
            </p>

            <div className="mt-2 text-gray-700 text-sm">
              <p>Bedrooms: {prop.bedrooms} | Bathrooms: {prop.bathrooms}</p>
              <p>Size: {prop.size} m²</p>
            </div>

            {/* Features */}
            {prop.features && prop.features.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {prop.features.map((f, i) => (
                  <span key={i} className="bg-gray-200 px-2 py-1 rounded text-xs">{f}</span>
                ))}
              </div>
            )}

            {/* Agent Info */}
            <div className="mt-3 border-t pt-2 text-sm">
              <p><span className="font-medium">Agent:</span> {prop.agent_name}</p>
              {prop.agent_phone && (
                <p>
                  <span className="font-medium">Phone:</span> {prop.agent_phone} {' '}
                  <a
                    href={`https://wa.me/${prop.agent_phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 ml-2"
                  >
                    WhatsApp
                  </a>
                </p>
              )}
            </div>

            {/* Delete Button for agent/admin */}
            {currentUser && (currentUser.id === prop.agent_id || currentUser.role === 'admin') && (
              <button
                onClick={() => deleteProp(prop.id)}
                className="mt-3 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PropertyList;
