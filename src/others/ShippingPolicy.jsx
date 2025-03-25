import React from "react";

const ShippingPolicy = () => {
  return (
    <div className="w-full mx-auto p-6 bg-gradient-to-t from-sky-200 to bg-white">
        <div className="container mx-auto px-4 py-10 max-w-6xl">
      <h1 className="text-3xl font-bold text-center border-b pb-3 mb-5">Shipping Policy</h1>
      
      <section className="mb-6">
        <h2 className="text-xl font-semibold">1. Order Processing</h2>
        <p>Orders are processed within <strong>1-2 business days</strong> after payment confirmation. Orders placed on weekends or holidays will be processed on the next business day.</p>
      </section>
      
      <section className="mb-6">
        <h2 className="text-xl font-semibold">2. Shipping Methods & Delivery Time</h2>
        <ul className="list-disc pl-5">
          <li><strong>Standard Delivery:</strong> 5-7 business days</li>
          <li><strong>Express Delivery:</strong> 2-4 business days</li>
          <li><strong>Local Pickup:</strong> Available for select locations</li>
        </ul>
      </section>
      
      <section className="mb-6">
        <h2 className="text-xl font-semibold">3. Shipping Charges</h2>
        <p>Shipping charges are calculated at checkout based on weight, location, and selected shipping method. Free shipping may be available on select products or promotions.</p>
      </section>
      
      <section className="mb-6">
        <h2 className="text-xl font-semibold">4. Tracking Information</h2>
        <p>Once shipped, you will receive a tracking number via email to monitor the status of your order.</p>
      </section>
      
      <section className="mb-6">
        <h2 className="text-xl font-semibold">5. Shipping Restrictions</h2>
        <p>Currently, we <strong>only ship within India</strong>. Some remote areas may experience longer delivery times.</p>
      </section>
      
      <section className="mb-6">
        <h2 className="text-xl font-semibold">6. Order Delays & Issues</h2>
        <p>If there are unexpected delays, we will notify you via email. Student Senior is not responsible for courier delays.</p>
      </section>
      
      <section className="mb-6">
        <h2 className="text-xl font-semibold">7. Damaged or Lost Shipments</h2>
        <p>If your order arrives damaged, contact us within <strong>48 hours</strong> with images of the product and packaging.</p>
      </section>
      
      <section className="mb-6">
        <h2 className="text-xl font-semibold">8. Refund & Cancellation Policy</h2>
        <p>Orders once shipped <strong>cannot be canceled</strong>. Refunds are only applicable in cases of non-delivery or damaged items.</p>
      </section>
      
      <section className="mb-6">
        <h2 className="text-xl font-semibold">9. Payment & Dispute Resolution</h2>
        <p>All payments are processed securely. If you face payment-related issues, contact our support team.</p>
      </section>
      
      <section>
        <h2 className="text-xl font-semibold">10. Contact Us</h2>
        <p>For shipping-related queries, reach us at <strong>studentsenior.help@gmail.com</strong> or call <strong>+91 9455346151</strong></p>
      </section>
      </div>
    </div>
  );
};

export default ShippingPolicy;