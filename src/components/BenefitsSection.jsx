function BenefitsSection() {
  return (
    <section className="py-20 bg-white scroll-fade">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left - Image */}
          <div className="order-2 md:order-1">
            <img
              src="https://img.freepik.com/free-vector/mobile-marketing-concept-illustration_114360-1527.jpg"
              alt="Digital Governance"
              className="rounded-2xl shadow-2xl"
            />
          </div>

          {/* Right - Benefits List */}
          <div className="order-1 md:order-2">
            <h2 className="text-3xl md:text-4xl font-bold text-govText mb-8">
              Benefits of Using <span className="text-govBlue">FixMyArea</span>
            </h2>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-govGreen bg-opacity-20 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🔍</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-govText mb-1">Complete Transparency</h3>
                  <p className="text-gray-600">
                    See real-time status updates and know exactly what's happening with your complaint
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-govBlue bg-opacity-20 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🚀</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-govText mb-1">Faster Action</h3>
                  <p className="text-gray-600">
                    Trending issues get prioritized, ensuring urgent problems are solved quickly
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-govGreen bg-opacity-20 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">👥</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-govText mb-1">Community Participation</h3>
                  <p className="text-gray-600">
                    Join forces with neighbors to highlight shared problems and demand action
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-govBlue bg-opacity-20 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📊</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-govText mb-1">Digital Record</h3>
                  <p className="text-gray-600">
                    Maintain permanent records of all issues and resolutions for future reference
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default BenefitsSection
