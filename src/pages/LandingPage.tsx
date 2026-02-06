import { useNavigate } from 'react-router-dom';
import { Button } from '../components/shared/Button';

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Design Your Dream Home
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Create your perfect home through our interactive design center. 
            Choose everything from foundation to finishing touches.
          </p>
          <Button onClick={() => navigate('/stage1')}>
            Start Designing
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl mb-4">🏗️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Foundation</h3>
            <p className="text-gray-600">
              Select your budget, home type, and room count to establish the basics
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Upgrades</h3>
            <p className="text-gray-600">
              Choose major enhancements like finished basements and landscaping
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl mb-4">🎨</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Interior</h3>
            <p className="text-gray-600">
              Pick design packages and customize finishes for each room
            </p>
          </div>
        </div>

        <div className="mt-16 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">How It Works</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Choose Your Foundation</h4>
                <p className="text-gray-600">Set your budget and select home type and room count</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Select Upgrades</h4>
                <p className="text-gray-600">Add features like finished basements and smart home technology</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Customize Interiors</h4>
                <p className="text-gray-600">Choose a design package or customize room by room</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Review & Submit</h4>
                <p className="text-gray-600">See your complete design and estimated price</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Your progress is automatically saved</p>
          <Button variant="outline" onClick={() => navigate('/stage1')}>
            Begin Your Journey
          </Button>
        </div>
      </div>
    </div>
  );
}
