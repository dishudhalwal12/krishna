import * as React from "react";
// Fix: Split framer-motion imports to resolve type errors and added AnimatePresence to enable exit animations.
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";
import { cn } from "../../lib/utils";
import { Star, Plus, Check } from "lucide-react";

// Fix: Switched from an interface to a type alias to resolve an issue where `className` was not being inherited from `HTMLMotionProps<"div">`.
type MenuItemCardProps = HTMLMotionProps<"div"> & {
  imageUrl: string;
  name: string;
  price: number;
  rating: number;
  onAddToCart: () => void;
};

const MenuItemCard = React.forwardRef<HTMLDivElement, MenuItemCardProps>(
  (
    {
      className,
      imageUrl,
      name,
      price,
      rating,
      onAddToCart,
      ...props
    },
    ref
  ) => {
    const [isAdded, setIsAdded] = React.useState(false);
    const timerRef = React.useRef<number | null>(null);
    const imgAnimationControls = useAnimation();

    const handleAddClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation(); // prevent card tap animation
      
      imgAnimationControls.start({
        rotateY: 360,
        scale: [1, 1.15, 1],
        transition: { duration: 0.5, ease: "easeInOut" },
      });
      
      onAddToCart();
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      setIsAdded(true);
      timerRef.current = window.setTimeout(() => {
        setIsAdded(false);
        timerRef.current = null;
      }, 1500);
    };

    React.useEffect(() => {
      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
      };
    }, []);

    return (
      <motion.div
        ref={ref}
        className={cn(
          "bg-card rounded-2xl p-4 flex flex-col items-center text-center cursor-pointer h-60",
          className
        )}
        whileHover={{ y: -8, scale: 1.03, boxShadow: "0px 5px 15px rgba(255, 255, 255, 0.1)" }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        {...props}
      >
        <div className="w-24 h-24 -mt-12 mb-2">
          <motion.img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover rounded-full shadow-lg"
            layoutId={`card-image-${name}`}
            animate={imgAnimationControls}
          />
        </div>
        <h4 className="font-semibold text-foreground mt-2 text-base flex-grow flex items-center justify-center">{name}</h4>
        <div className="flex items-center text-sm text-muted-foreground my-1">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span className="ml-1">{rating.toFixed(1)}</span>
        </div>
        <div className="flex justify-between items-center w-full mt-4">
          <span className="font-bold text-lg text-foreground">₹{price}</span>
          <motion.button 
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300",
              isAdded 
                ? "bg-green-500 text-white" 
                : "bg-primary text-primary-foreground"
            )}
            aria-label={`Add ${name} to order`}
            onClick={handleAddClick}
            whileTap={{ scale: 0.9 }}
            disabled={isAdded}
          >
            {/* Fix: Wrapped icon switch in AnimatePresence to enable exit animations. */}
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={isAdded ? "check" : "plus"}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {isAdded ? (
                  <Check className="w-6 h-6" />
                ) : (
                  <Plus className="w-6 h-6" />
                )}
              </motion.div>
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.div>
    );
  }
);

MenuItemCard.displayName = "MenuItemCard";

export { MenuItemCard };