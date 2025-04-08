import os
from autogen import ConversableAgent
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")

if not api_key:
    raise ValueError("OPENAI_API_KEY is not set in the .env file.")

def init_agents():
    defense_agent = ConversableAgent(
        name="Defense_Attorney",
        system_message="""You are a defense attorney representing the accused. Analyze all evidence, challenge the prosecution's arguments, and ensure justice.""",
        llm_config={"config_list": [{"model": "gpt-4", "api_key": api_key}]},
        human_input_mode="NEVER"
    )

    prosecution_agent = ConversableAgent(
        name="Prosecution_Attorney",
        system_message="""You are a prosecutor seeking justice. Present compelling arguments, establish guilt, and refute the defense's claims.""",
        llm_config={"config_list": [{"model": "gpt-4", "api_key": api_key}]},
        human_input_mode="NEVER"
    )

    judge_agent = ConversableAgent(
        name="Presiding_Judge",
        system_message="""You are a fair judge. Carefully review arguments, assess facts, and deliver a reasoned verdict.""",
        llm_config={"config_list": [{"model": "gpt-4", "api_key": api_key}]},
        human_input_mode="NEVER"
    )

    return defense_agent, prosecution_agent, judge_agent

def format_chat(chat_result):
    history = chat_result.chat_history if hasattr(chat_result, "chat_history") else []
    return [
        {"role": entry.get("name", "Unknown"), "content": entry.get("content", "")}
        for entry in history
    ]

def run_courtroom_simulation(case_text: str):
    defense, prosecution, judge = init_agents()

    # Step 1: Defense
    defense_initial = defense.initiate_chat(
        prosecution,
        message=f"Case Overview: {case_text[:500]}\nPresent your defense.",
        max_turns=1
    )

    # Step 2: Prosecution
    prosecution_response = prosecution.initiate_chat(
        defense,
        message="Respond to the defense's arguments.",
        max_turns=1
    )

    # Step 3: Defense Rebuttal
    defense_rebuttal = defense.initiate_chat(
        prosecution,
        message="Rebut the prosecution's points and reinforce your arguments.",
        max_turns=1
    )

    # Step 4: Judge Verdict
    final_verdict = judge.initiate_chat(
        defense,
        message=f"""Case Summary:
        Defense: {defense_initial.chat_history[-1]['content'][:300]}
        Prosecution: {prosecution_response.chat_history[-1]['content'][:300]}
        Rebuttal: {defense_rebuttal.chat_history[-1]['content'][:300]}
        Deliver your final verdict.""",
        max_turns=1
    )

    return {
        "defense": format_chat(defense_initial),
        "prosecution": format_chat(prosecution_response),
        "rebuttal": format_chat(defense_rebuttal),
        "verdict": format_chat(final_verdict),
    }
