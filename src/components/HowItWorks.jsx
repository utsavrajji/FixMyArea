function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-gradient-to-br from-govLinen to-white scroll-fade">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-govText mb-4">
            How It <span className="text-govBlue">Works</span>
          </h2>
          <p className="text-lg text-gray-600">Simple 3-step process to make your locality better</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting Line (hidden on mobile) */}
          <div className="hidden md:block absolute top-24 left-1/4 right-1/4 h-1 bg-govBlue opacity-20"></div>

          {/* Step 1 */}
          <div className="relative text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-govBlue text-white rounded-full flex items-center justify-center text-xl font-bold shadow-lg">
              1
            </div>
            <div className="mt-8">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-2xl font-bold text-govText mb-3">Post Your Issue</h3>
              <p className="text-gray-600">
                Report any local problem with a photo and description. Select your area and category.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-govGreen text-white rounded-full flex items-center justify-center text-xl font-bold shadow-lg">
              2
            </div>
            <div className="mt-8">
              <div className="text-6xl mb-4">👍</div>
              <h3 className="text-2xl font-bold text-govText mb-3">Community Upvotes</h3>
              <p className="text-gray-600">
                Other citizens upvote, comment, and verify the issue to increase visibility.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-govBlue text-white rounded-full flex items-center justify-center text-xl font-bold shadow-lg">
              3
            </div>
            <div className="mt-8">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-2xl font-bold text-govText mb-3">Government Solves</h3>
              <p className="text-gray-600">
                Government reviews, takes action, and marks the issue as resolved with updates.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
