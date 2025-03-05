import os
import uuid
import sounddevice as sd
import soundfile as sf
import numpy as np
from dotenv import load_dotenv
import assemblyai as aai
import google.generativeai as genai
from elevenlabs.client import ElevenLabs

def select_language():
    while True:
        print("\n--- DeviMitra Language Selection ---")
        print("1. English")
        print("2. हिन्दी (Hindi)")
        print("3. தமிழ் (Tamil)")
        print("4. Exit")
        
        try:
            choice = input("Enter your choice (1-4): ").strip()
            
            if choice == '1':
                return "english"
            elif choice == '2':
                return "hindi"
            elif choice == '3':
                return "tamil"
            elif choice == '4':
                print("Exiting the application.")
                exit()
            else:
                print("Invalid choice. Please enter a number between 1 and 4.")
        except Exception as e:
            print(f"An error occurred: {e}")
            print("Please try again.")

class AI_Assistant:
    def __init__(self):
        # Load environment variables
        load_dotenv()

        # Set up API keys from environment variables
        self.assemblyai_api_key = os.getenv('ASSEMBLYAI_API_KEY')
        self.gemini_api_key = os.getenv('GEMINI_API_KEY')
        self.elevenlabs_api_key = os.getenv('ELEVENLABS_API_KEY')

        # Validate API keys
        self._validate_api_keys()

        # Set up AssemblyAI
        aai.settings.api_key = self.assemblyai_api_key

        # Set up Gemini
        genai.configure(api_key=self.gemini_api_key)
        self.model = genai.GenerativeModel('gemini-2.0-flash')  # Updated to a known model; verify with Gemini docs

        # Set up ElevenLabs
        self.elevenlabs_client = ElevenLabs(api_key=self.elevenlabs_api_key)

        # Audio recording setup
        self.sample_rate = 16000
        self.channels = 1

        # Conversation history
        self.conversation_history = []

        # Language selection
        self.language = select_language()
        self.language_config = {
            "english": {
                "code": "en_us",
                "prompt": "Provide a helpful and concise response in English.",
                "listening": "Listening... (Speak now)",
                "you_said": "You said: {transcript}",
                "greeting": "Hello! I am DeviMitra, your AI assistant. How can I help you today?",
                "error": "I'm having trouble generating a response right now.",
                "end": "Conversation ended."
            },
            "hindi": {
                "code": "hi",
                "prompt": "Provide a helpful and concise response in Hindi.",
                "listening": "सुन रही हूँ... (अब बोलें)",
                "you_said": "आपने कहा: {transcript}",
                "greeting": "नमस्ते! मैं देवीमित्रा हूँ, आपकी AI सहायक। आज मैं आपकी कैसे मदद कर सकती हूँ?",
                "error": "मुझे अभी जवाब देने में समस्या हो रही है।",
                "end": "बातचीत समाप्त हुई।"
            },
            "tamil": {
                "code": "ta",
                "prompt": "Provide a helpful and concise response in Tamil.",
                "listening": "கேட்கிறேன்... (இப்போது பேசுங்கள்)",
                "you_said": "நீங்கள் சொன்னீர்கள்: {transcript}",
                "greeting": "வணக்கம்! நான் DeviMitra, உங்கள் AI உதவியாளர்। நான் உங்களுக்கு இன்று எப்படி உதவ முடியும்?",
                "error": "எனக்கு இப்போது பதில் அளிப்பதில் சிக்கல் உள்ளது।",
                "end": "உரையாடல் முடிந்தது।"
            }
        }

    def _validate_api_keys(self):
        """
        Validate that all required API keys are present
        """
        missing_keys = []
        if not self.assemblyai_api_key:
            missing_keys.append("ASSEMBLYAI_API_KEY")
        if not self.gemini_api_key:
            missing_keys.append("GEMINI_API_KEY")
        if not self.elevenlabs_api_key:
            missing_keys.append("ELEVENLABS_API_KEY")
        
        if missing_keys:
            raise ValueError(f"Missing API keys: {', '.join(missing_keys)}")

    def generate_audio(self, text):
        """
        Generate and play audio using ElevenLabs
        """
        try:
            # Generate audio
            response = self.elevenlabs_client.text_to_speech.convert(
                voice_id="MF4J4IDTRo0AxOO4dpFR",  # Devi
                text=text,
                model_id="eleven_multilingual_v2"  # Supports Hindi
            )

            # Save to a temporary file
            temp_file = f"{uuid.uuid4()}.mp3"
            with open(temp_file, "wb") as f:
                for chunk in response:
                    if chunk:
                        f.write(chunk)

            # Play the audio file
            data, samplerate = sf.read(temp_file)
            sd.play(data, samplerate)
            sd.wait()

            # Remove the temporary file
            os.remove(temp_file)

            print(f"AI: {text}")

        except Exception as e:
            print(f"Audio generation error: {e}")

    def record_audio(self, max_duration=5):
        """
        Record audio from microphone
        """
        print(f"\n{self.language_config[self.language]['listening']}")
        
        # Record audio
        recording = sd.rec(
            int(max_duration * self.sample_rate), 
            samplerate=self.sample_rate, 
            channels=self.channels,
            dtype='float32'
        )
        sd.wait()

        return recording

    def transcribe_audio(self, audio_data):
        """
        Transcribe recorded audio with fallback for Tamil
        """
        try:
            # Save audio to a temporary file
            temp_file = f"{uuid.uuid4()}_recording.wav"
            sf.write(temp_file, audio_data, self.sample_rate)

            # Explicit language handling
            if self.language == 'tamil':
                print("Warning: Tamil transcription is limited. Manually transcribe or use alternative method.")
                # Option 1: Prompt user to manually type their input
                manual_transcript = input("Please manually type your input in Tamil: ")
                os.remove(temp_file)
                return manual_transcript

            # Use default transcription for other languages
            config = aai.TranscriptionConfig(language_code=self.language_config[self.language]['code'])
            transcriber = aai.Transcriber(config=config)
            transcript = transcriber.transcribe(temp_file)

            # Remove temporary file
            os.remove(temp_file)

            return transcript.text
        except Exception as e:
            print(f"Transcription error: {e}")
            return None

    def generate_ai_response(self, user_input):
        """
        Generate AI response using Gemini
        """
        try:
            # Add user input to conversation history
            self.conversation_history.append(f"User: {user_input}")

            # Generate response in selected language
            response = self.model.generate_content(
                f"Conversation history: {' | '.join(self.conversation_history[-5:])}\n\n"
                f"Latest user input: {user_input}\n"
                f"{self.language_config[self.language]['prompt']}"
            )

            # Extract text response
            ai_response = response.text

            # Add AI response to conversation history
            self.conversation_history.append(f"AI: {ai_response}")

            return ai_response
        except Exception as e:
            print(f"Response generation error: {e}")
            return self.language_config[self.language]['error']

    def interactive_loop(self):
        """
        Main interactive loop
        """
        # Initial greeting in selected language
        greeting = self.language_config[self.language]['greeting']
        self.generate_audio(greeting)

        try:
            while True:
                # Record audio
                audio_data = self.record_audio()

                # Transcribe audio
                transcript = self.transcribe_audio(audio_data)

                if transcript and transcript.strip():
                    print(f"{self.language_config[self.language]['you_said'].format(transcript=transcript)}")

                    # Generate AI response
                    ai_response = self.generate_ai_response(transcript)

                    # Generate and play audio response
                    self.generate_audio(ai_response)

        except KeyboardInterrupt:
            print(f"\n{self.language_config[self.language]['end']}")

def main():
    try:
        ai_assistant = AI_Assistant()
        ai_assistant.interactive_loop()
    except ValueError as e:
        print(f"Configuration Error: {e}")
        print("Please set up your .env file with the required API keys.")

if __name__ == "__main__":
    main()