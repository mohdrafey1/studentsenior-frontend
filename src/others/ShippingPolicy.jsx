const ShippingPolicy = () => {
  return (
    <div className="bg-gradient-to-t from-sky-200 to bg-white">
      <div className="max-w-4xl mx-auto p-6 ">
        <h1 className="text-3xl font-bold text-black mb-4">Shipping Policy</h1>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold">1. Order Processing</h2>
          <p className="text-gray-700">
            Orders are processed within <strong>1-3 business days</strong> after payment confirmation.
            Orders placed on weekends or holidays will be processed on the next business day.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold">2. Shipping Time</h2>
          <p className="text-gray-700">
            The estimated delivery time depends on your location:
          </p>
          <ul className="list-disc pl-6 text-gray-700">
            <li><strong>Within India:</strong> 3-7 business days</li>
            <li><strong>International:</strong> 7-15 business days</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold">3. Shipping Charges</h2>
          <p className="text-gray-700">
            Shipping charges are calculated at checkout based on the delivery location and package weight.
            Free shipping may be available for certain orders, as mentioned in promotions.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold">4. Tracking Information</h2>
          <p className="text-gray-700">
            Once your order is shipped, you will receive an email with a tracking number and a link to track your shipment.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold">5. Delayed or Lost Shipments</h2>
          <p className="text-gray-700">
            If your order is delayed beyond the expected delivery time, please contact us at
            <strong> studentsenior.help@gmail.com</strong>. If the order is lost, we will assist you in resolving the issue with the shipping provider.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold">6. Refund & Cancellation</h2>
          <p className="text-gray-700">
            Orders can be canceled before they are shipped. Refunds will be processed within 7-10 business days.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold">7. Contact Us</h2>
          <p className="text-gray-700">
            If you have any questions, feel free to reach out to us at
            <a
              href="mailto:studentsenior.help@gmail.com"
              className="text-blue-500 hover:underline"
            >
              {' '}
              studentsenior.help@gmail.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
};

export default ShippingPolicy;
