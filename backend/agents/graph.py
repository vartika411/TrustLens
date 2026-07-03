from langgraph.graph import StateGraph, END

from .state import AnalysisState

from .nodes import (
    classify_media,
    metadata_node,
    compression_node,
    ai_detector_node,
    trust_score_agent,
    summary_agent,
    image_analysis_node,
    video_agent,
)
from .explanation_agent import explanation_agent

builder = StateGraph(
    AnalysisState
)

builder.add_node(
    "classify",
    classify_media
)

builder.add_node(
    "metadata",
    metadata_node
)

builder.add_node(
    "compression",
    compression_node
)

builder.add_node(
    "ai_detector",
    ai_detector_node
)

builder.add_node(
    "trust_score",
    trust_score_agent
)

builder.add_node(
    "summary",
    summary_agent
)

builder.add_node(
    "video_agent",
    video_agent
)
builder.add_node(
    "image_analysis",
    image_analysis_node
)
builder.add_node(
    "explanation",
    explanation_agent
)



builder.set_entry_point(
    "classify"
)

builder.add_conditional_edges(
    "classify",
    lambda state: state["media_type"],
    {
        "image": "metadata",
        "video": "video_agent",
    }
)

builder.add_edge(
    "metadata",
    "image_analysis"
)

builder.add_edge(
    "image_analysis",
    "compression"
)

builder.add_edge(
    "compression",
    "ai_detector"
)

builder.add_edge(
    "ai_detector",
    "trust_score"
)

builder.add_edge(
    "video_agent",
    "trust_score"
)

builder.add_edge(
    "trust_score",
    "explanation"
)
builder.add_edge(
    "explanation",
    "summary"
)

builder.add_edge(
    "summary",
    END
)

graph = builder.compile()