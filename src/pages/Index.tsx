
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Gift, PenSquare, Calendar, GamepadIcon } from "lucide-react";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-love-100 to-purple-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative z-10 py-16 md:py-28 lg:py-32">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="text-center md:text-left">
                <h1 className="text-4xl font-display font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block text-purple-700">Share the joy of</span>{" "}
                  <span className="block text-love-600">being together</span>
                </h1>
                <p className="mt-3 max-w-md mx-auto md:mx-0 text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl">
                  Celebrate your relationship with our special platform designed for couples. Create memories, share moments, and grow together.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row justify-center md:justify-start gap-3">
                  <Link to="/register">
                    <Button size="lg" className="w-full sm:w-auto bg-love-500 hover:bg-love-600">
                      Get Started
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto">
                      Sign In
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="hidden md:block relative">
                <div className="relative h-64 w-64 mx-auto">
                  <div className="absolute inset-0 bg-pink-500 rounded-full opacity-10 animate-pulse"></div>
                  <div className="absolute inset-4 bg-love-500 rounded-full opacity-20 animate-pulse delay-300"></div>
                  <div className="absolute inset-8 bg-purple-500 rounded-full opacity-20 animate-pulse delay-700"></div>
                  <Heart className="absolute inset-0 h-full w-full text-love-500 p-12 animate-heartbeat" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-white rounded-t-3xl"></div>
      </div>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-display font-bold text-gray-900 sm:text-4xl">
              Celebrate Your Love Journey
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Everything you need to nurture your relationship in one place.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="love-card hover:shadow-lg hover:scale-105 transition-all duration-300">
              <div className="h-12 w-12 rounded-lg bg-love-100 flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-love-600" />
              </div>
              <h3 className="text-xl font-medium text-gray-900">
                Birthday Countdown
              </h3>
              <p className="mt-2 text-base text-gray-500">
                Never forget your partner's special day. Get reminders and plan the perfect surprise.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="love-card hover:shadow-lg hover:scale-105 transition-all duration-300">
              <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
                <PenSquare className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-medium text-gray-900">
                Love Letters
              </h3>
              <p className="mt-2 text-base text-gray-500">
                Write and save beautiful notes for your partner. Express your feelings in a meaningful way.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="love-card hover:shadow-lg hover:scale-105 transition-all duration-300">
              <div className="h-12 w-12 rounded-lg bg-peach-100 flex items-center justify-center mb-4">
                <GamepadIcon className="h-6 w-6 text-peach-600" />
              </div>
              <h3 className="text-xl font-medium text-gray-900">
                Couples Game
              </h3>
              <p className="mt-2 text-base text-gray-500">
                Have fun together with our special memory game designed to strengthen your bond.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-16 bg-gradient-to-b from-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-gray-900 sm:text-4xl">
              Couples Love Our App
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Hear what our users have to say about their experience.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Testimonial 1 */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-love-200 flex items-center justify-center mr-3">
                  <span className="text-love-700 font-medium">S</span>
                </div>
                <div>
                  <h4 className="text-base font-medium text-gray-900">
                    Sarah & James
                  </h4>
                  <p className="text-sm text-gray-500">Together for 3 years</p>
                </div>
              </div>
              <p className="text-gray-600">
                "The birthday countdown feature is so thoughtful! It helped me plan the perfect surprise for my partner's special day."
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-purple-200 flex items-center justify-center mr-3">
                  <span className="text-purple-700 font-medium">M</span>
                </div>
                <div>
                  <h4 className="text-base font-medium text-gray-900">
                    Michael & Lisa
                  </h4>
                  <p className="text-sm text-gray-500">Together for 5 years</p>
                </div>
              </div>
              <p className="text-gray-600">
                "We love writing love letters to each other. It's become our special ritual and has made our relationship stronger."
              </p>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-peach-200 flex items-center justify-center mr-3">
                  <span className="text-peach-700 font-medium">D</span>
                </div>
                <div>
                  <h4 className="text-base font-medium text-gray-900">
                    David & Emma
                  </h4>
                  <p className="text-sm text-gray-500">Together for 2 years</p>
                </div>
              </div>
              <p className="text-gray-600">
                "The couples game is so much fun! We play it every weekend and always end up laughing and learning new things about each other."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-love-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-display font-bold text-white sm:text-4xl">
            Ready to start your love journey?
          </h2>
          <p className="mt-3 max-w-md mx-auto text-xl text-love-100 sm:mt-4">
            Join thousands of happy couples today.
          </p>
          <div className="mt-8">
            <Link to="/register">
              <Button size="lg" className="bg-white text-love-600 hover:bg-love-50">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
