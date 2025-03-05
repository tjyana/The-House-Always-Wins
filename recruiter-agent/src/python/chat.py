import langchain_core
from langchain_core.messages import HumanMessage
from langchain_openai import ChatOpenAI
from morph_lib.stream import stream_chat

import morph
from morph import MorphGlobalContext


@morph.func
def chat(context: MorphGlobalContext):
    llm = ChatOpenAI(model="gpt-4o")
    print(context.vars["prompt"])
    messages = [HumanMessage(context.vars["prompt"])]
    for token in llm.stream(messages):
        yield stream_chat(token.content)
