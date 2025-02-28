import { Link } from "react-router-dom";
import { USER } from "../../config/routes/user.routes";
import { VendorType } from "../../interfaces/commonTypes";

interface VendorTypeProps {
  vendorTypeData: VendorType[];
}

const VendorTypeImages = ({ vendorTypeData }: VendorTypeProps) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {vendorTypeData.map(({ imageUrl, type, id }) => (
          <Link
            to={`${USER.VENDORS}?category=${id}`} // Pass category ID for filtering
            key={id}
            className="group block relative rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            {/* Image Container */}
            <div className="aspect-square overflow-hidden">
              <img
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                src={imageUrl}
                alt={type}
                loading="lazy" // Lazy load images for better performance
              />
            </div>

            {/* Overlay with Category Name */}
            <div className="absolute inset-0 flex items-end justify-center p-4 bg-gradient-to-t from-black/60 to-transparent">
              <h3 className="text-white text-lg font-semibold text-center">
                {type}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default VendorTypeImages;