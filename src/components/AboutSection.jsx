function AboutSection() {
  return (
    <section className="py-20 bg-white scroll-fade">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-govText mb-4">
            Why <span className="text-govBlue">FixMyArea?</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Bridging the gap between citizens and government for faster resolution of local issues
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Benefit 1 */}
          <div className="text-center p-6 rounded-xl bg-govLinen hover:shadow-lg transition-shadow duration-300">
            <div className="w-16 h-16 bg-govBlue rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🗣️</span>
            </div>
            <h3 className="text-xl font-semibold text-govText mb-2">Citizens Voice Heard</h3>
            <p className="text-gray-600">
              Every citizen gets a platform to report and track local issues easily
            </p>
          </div>

          {/* Benefit 2 */}
          <div className="text-center p-6 rounded-xl bg-govLinen hover:shadow-lg transition-shadow duration-300">
            <div className="w-16 h-16 bg-govGreen rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⚡</span>
            </div>
            <h3 className="text-xl font-semibold text-govText mb-2">Faster Response</h3>
            <p className="text-gray-600">
              Government departments get instant notifications for urgent issues
            </p>
          </div>

          {/* Benefit 3 */}
          <div className="text-center p-6 rounded-xl bg-govLinen hover:shadow-lg transition-shadow duration-300">
            <div className="w-16 h-16 bg-govBlue rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">👁️</span>
            </div>
            <h3 className="text-xl font-semibold text-govText mb-2">Transparent Tracking</h3>
            <p className="text-gray-600">
              Track your issue status from submission to resolution in real-time
            </p>
          </div>

          {/* Benefit 4 */}
          <div className="text-center p-6 rounded-xl bg-govLinen hover:shadow-lg transition-shadow duration-300">
            <div className="w-16 h-16 bg-govGreen rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🤝</span>
            </div>
            <h3 className="text-xl font-semibold text-govText mb-2">Community Power</h3>
            <p className="text-gray-600">
              Upvote and verify issues to help prioritize what matters most
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutSection
