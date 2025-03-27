import React, { useEffect, useState } from "react";

const Cart = () => {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [coupon, setCoupon] = useState("");
    const [discount, setDiscount] = useState(0);

    const cartData = {
        Allproducts: [
            {
                title: "HTML, CSS, JS - Web Development for Beginners",
                price: 999,
                thumbnail: "/assets/course1.jpg",
                description: "Learn the fundamentals of web development with HTML, CSS, and JavaScript.",
                details: {
                    duration: "6 Weeks",
                    timings: "7 PM - 9 PM IST",
                }
            },
            {
                title: "MERN Stack Mastery - Full-Stack Web Development",
                price: 4999,
                thumbnail: "/assets/course2.jpg",
                description: "Master full-stack development with MongoDB, Express, React, and Node.js.",
                details: {
                    duration: "10 Weeks",
                    timings: "7 PM - 10 PM IST",
                }
            }
        ],
        coupons: {
            NEW500: 500
        }
    };

    useEffect(() => {
        const storedIndex = localStorage.getItem("course-id");
        console.log("Stored Index:", storedIndex);

        if (storedIndex !== null) {
            const index = parseInt(storedIndex, 10);
            console.log("Parsed Index:", index);

            if (!isNaN(index) && index >= 0 && index < cartData.Allproducts.length) {
                setSelectedProduct(cartData.Allproducts[index]);
            }
        }
    }, []);

    const applyCoupon = () => {
        if (cartData.coupons[coupon]) {
            setDiscount(cartData.coupons[coupon]);
        } else {
            setDiscount(0);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-t from-sky-500 to-white p-6">
            <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-3xl">
                <h2 className="text-2xl font-bold text-gray-700 mb-6">Your Cart</h2>

                {selectedProduct ? (
                    <div className="bg-teal-100 rounded-xl p-6 mb-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <img src={selectedProduct.thumbnail} alt={selectedProduct.title} className="w-20 h-20 object-cover rounded-lg" />
                                <div>
                                    <h3 className="text-lg font-semibold">{selectedProduct.title}</h3>
                                    <p className="text-sm text-gray-600">
                                        {selectedProduct.details.duration} | {selectedProduct.details.timings}
                                    </p>
                                </div>
                            </div>
                            <p className="font-semibold text-lg text-gray-800">₹{selectedProduct.price}</p>
                        </div>
                    </div>
                ) : (
                    <p className="text-red-500">⚠️ No product selected. Please choose a course.</p>
                )}

                {/* Coupon Section */}
                <div className="flex items-center space-x-4 mb-6">
                    <input 
                        type="text" 
                        placeholder="Enter coupon code" 
                        className="border border-gray-300 rounded-lg px-4 py-2 w-2/3" 
                        value={coupon}
                        onChange={(e) => setCoupon(e.target.value)}
                    />
                    <button 
                        className="bg-green-500 text-white px-5 py-2 rounded-lg hover:bg-green-600 transition"
                        onClick={applyCoupon}
                    >
                        Apply
                    </button>
                    {discount > 0 && <span className="text-green-600">Coupon Applied!</span>}
                </div>

                {/* Total Amount Section */}
                {selectedProduct && (
                    <div className="bg-gray-100 rounded-xl p-6 mb-6">
                        <div className="flex justify-between text-gray-700">
                            <p>{selectedProduct.title}</p>
                            <p>₹{selectedProduct.price}</p>
                        </div>
                        <div className="border-t border-gray-300 my-3"></div>
                        {discount > 0 && (
                            <div className="flex justify-between text-green-600">
                                <p>Coupon ({coupon})</p>
                                <p>- ₹{discount}</p>
                            </div>
                        )}
                        <div className="border-t border-gray-300 my-3"></div>
                        <div className="flex justify-between font-bold text-lg">
                            <p>Total</p>
                            <p>₹{selectedProduct.price - discount}</p>
                        </div>
                    </div>
                )}

                <button className="w-full bg-green-500 text-white py-3 rounded-lg text-lg font-semibold hover:bg-green-600 transition">
                    Proceed
                </button>
            </div>
        </div>
    );
};

export default Cart;
