import PromptCard from '../components/PromptCard'
import { promptLibrary } from '../config/prompts'

export default function PromptLibrary() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-dell-gray">AI Prompt Library — Use These Outside This App</h1>
      <p className="mt-2 max-w-2xl text-sm text-gray-600">
        Want to use AI tools (like ChatGPT, Copilot, or other approved tools) to go even deeper?
        Here are ready-to-use prompts you can copy and paste.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {promptLibrary.map((card) => (
          <PromptCard key={card.category} data={card} />
        ))}
      </div>

      <div className="mt-8 rounded-lg border border-gray-200 bg-dell-gray-light p-4 text-xs text-gray-500">
        Always review AI-generated content for accuracy before including it in your presentation.
        These prompts are starting points — customize them with your specific project details.
      </div>
    </div>
  )
}
