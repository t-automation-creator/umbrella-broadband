import { Link } from "wouter";

export default function CTA() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-primary mb-6 font-heading">
          Ready to Upgrade Your Connectivity?
        </h2>
        <p className="text-lg text-gray-600 mb-8 font-sans">
          We’re committed to providing outstanding service across all sectors. Contact us today to learn how our broadband solutions can meet your needs.
        </p>
        <Link href="/contact">
          <span className="btn btn-primary cursor-pointer">Get Started Today</span>
        </Link>
      </div>
    </section>
  );
}
