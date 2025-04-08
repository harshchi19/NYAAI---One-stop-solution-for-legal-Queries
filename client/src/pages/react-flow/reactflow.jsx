import { useCallback, useState, useRef } from "react";
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Send } from "lucide-react";
import { useTheme } from "next-themes";
import Navbar from '../../components/Navbar';
import axios from 'axios';

const GEMINI_API_KEY = "AIzaSyAwY29cyESToWBGM3Rg2mEghTJUGyMaoJw";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

const sampleInputs = [
  {
    title: "Simple Case",
    text: "",
  },
  {
    title: "Contract Dispute",
    text: "I need a legal pathway for resolving a contract dispute with a vendor. The contract value is $50,000, and the issue involves non-delivery of goods.",
  },
  {
    title: "Complex Litigation",
    text: "I'm facing a high-stakes lawsuit involving intellectual property theft. I need a detailed legal strategy for a case that may last 2-3 years. I’m prepared for aggressive defense and counterclaims.",
  },
  {
    title: "Example Prompt 1",
    text: "I am a small business owner facing a dispute with a former employee over a non-compete clause. My goal is to protect my business interests while avoiding prolonged litigation. I prefer negotiation or mediation but am open to court if necessary. My case involves sensitive client data, and I need a strategy that ensures confidentiality. My ideal resolution timeline is 6-12 months. Please generate an optimal legal pathway based on these preferences, ensuring risk management and efficiency.",
  },
  {
    title: "Example Prompt 2",
    text: "Analyze potential legal risks and strategies for a startup facing regulatory scrutiny over data privacy compliance in Q3-Q4 2025. Include the impact of upcoming legislation, estimated legal costs, and recommended defensive actions.",
  },
  {
    title: "Example Prompt 3",
    text: "Generate a detailed legal strategy for a real estate company facing a zoning dispute. Focus on timelines, potential appeals, and negotiation tactics over the next 12 months. Assume new municipal regulations and provide risk management strategies.",
  },
];

// Light color palette for nodes
const lightColorPalette = [
  { background: "#DBEAFE", border: "#93C5FD", text: "#1E40AF" },
  { background: "#D1FAE5", border: "#6EE7B7", text: "#065F46" },
  { background: "#EDE9FE", border: "#C4B5FD", text: "#5B21B6" },
  { background: "#FEF3C7", border: "#FCD34D", text: "#92400E" },
  { background: "#FCE7F3", border: "#F9A8D4", text: "#9D174D" },
];

// Edge colors matching with nodes
const edgeColorPalette = ["#60A5FA", "#34D399", "#8B5CF6", "#FBBF24", "#F472B6"];

const LegalPathFlow = () => {
  const [activeTab, setActiveTab] = useState("simple");
  const [userInput, setUserInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showFlowchart, setShowFlowchart] = useState(false);
  const textareaRef = useRef(null);
  const [serverData, setServerData] = useState(null);
  const flowchartRef = useRef(null);
  const { theme } = useTheme();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleStrategySelect = (strategy) => setActiveTab(strategy);

  const handleGenerate = async () => {
    if (!activeTab || !userInput) {
      alert("Please select a strategy and provide input.");
      return;
    }

    setIsGenerating(true);
    setShowFlowchart(false);

    try {
      const prompt = `
        Return ONLY a valid JSON object with two keys: "nodes" and "edges".
        Given the following legal scenario: "${userInput}", generate a legal pathway for a "${activeTab}" strategy.
        - "nodes" should be an array of objects with "id" (string), "data" (object with "label" string), and optional "position" (object with "x" and "y" numbers).
        - "edges" should be an array of objects with "id" (string), "source" (string), "target" (string), and optional "label" (string).
        Ensure the pathway is logical, sequential, and tailored to the user's input and selected strategy. Do not include any additional text or explanations.
      `;

      console.log("Sending request with prompt:", prompt);
      const response = await axios.post(
        `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
        {
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            maxOutputTokens: 1500,
            temperature: 0.7,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("API Response:", response.data);
      const generatedText = response.data.candidates[0].content.parts[0].text.trim();
      console.log("Generated Text:", generatedText);

      // Attempt to clean and parse the response
      let data;
      try {
        // Remove any leading/trailing whitespace or invalid characters
        const jsonMatch = generatedText.match(/\{.*\}/s); // Match the first JSON object
        if (jsonMatch && jsonMatch[0]) {
          data = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("No valid JSON object found in response");
        }
      } catch (parseError) {
        console.error("JSON Parsing Error:", parseError.message, "Raw Text:", generatedText);
        throw new Error(`Invalid JSON format: ${parseError.message}`);
      }

      setServerData(data);

      const colorMap = {};
      setNodes(
        data.nodes.map((node, index) => {
          const colorIdx = Math.floor(Math.random() * lightColorPalette.length);
          const colorStyle = lightColorPalette[colorIdx];
          colorMap[node.id] = colorIdx;

          return {
            ...node,
            position: node.position || { x: 250 + index * 150, y: index * 100 },
            style: {
              background: colorStyle.background,
              border: `2px solid ${colorStyle.border}`,
              borderRadius: "8px",
              padding: "16px",
              textAlign: "center",
              fontWeight: "500",
              color: colorStyle.text,
            },
            data: {
              ...node.data,
              label: node.data.label || "Unnamed Node",
            },
          };
        })
      );

      setEdges(
        data.edges.map((edge) => {
          const sourceColorIdx = colorMap[edge.source] || 0;
          return {
            ...edge,
            style: { stroke: edgeColorPalette[sourceColorIdx] || "#000", strokeWidth: 2 },
            type: "smoothstep",
            animated: true,
          };
        })
      );

      setShowFlowchart(true);

      setTimeout(() => {
        flowchartRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    } catch (error) {
      console.error("Error Details:", error.response ? error.response.data : error.message);
      alert(`Failed to generate legal pathway. Please check the console for details. Error: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTextareaInput = (e) => {
    setUserInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleSampleInput = (text) => {
    setUserInput(text);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const tabs = [
    {
      id: "simple",
      label: "Simple",
      color: "#3B82F6",
      description:
        "A straightforward legal approach for low-complexity cases, focusing on quick resolution with minimal resources.",
      timeline: "3-6 months",
      suitability: "Ideal for minor disputes or small claims.",
      suggestedApproaches: ["Negotiation", "Mediation", "Small Claims Court"],
    },
    {
      id: "moderate",
      label: "Moderate",
      color: "#EC4899",
      description:
        "A balanced legal strategy for cases with moderate complexity, aiming for resolution while managing risks.",
      timeline: "6-12 months",
      suitability: "Suitable for business disputes or contract breaches.",
      suggestedApproaches: ["Mediation", "Arbitration", "Litigation"],
    },
    {
      id: "complex",
      label: "Complex",
      color: "#EF4444",
      description:
        "An aggressive legal strategy for high-stakes, complex cases requiring extensive preparation and resources.",
      timeline: "1-3 years",
      suitability: "Best for multi-party litigation or regulatory challenges.",
      suggestedApproaches: ["Litigation", "Appeals", "Counterclaims"],
    },
  ];

  return (
    <main>
      <Navbar />
      <div style={{ margin: "0 auto", padding: "8px 0", display: "flex", flexDirection: "column", gap: "32px" }}>
        <div
          style={{
            background: "#fff",
            borderRadius: "16px",
            boxShadow: "0 10px 15px rgba(0,0,0,0.1)",
            border: "1px solid #e5e7eb",
            overflow: "hidden",
            transition: "all 0.3s",
          }}
        >
          <div
            style={{
              padding: "16px",
              background: "linear-gradient(to bottom right, #e5e7eb, #d1d5db)",
              borderBottom: "1px solid #e5e7eb",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
              <span style={{ fontSize: "14px", fontWeight: "500", color: "#374151" }}>
                Sample Inputs:
              </span>
              <span style={{ marginLeft: "8px", fontSize: "12px", color: "#6b7280" }}>
                (Click to populate)
              </span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {sampleInputs.map((sample, index) => (
                <button
                  key={index}
                  onClick={() => handleSampleInput(sample.text)}
                  style={{
                    padding: "6px 12px",
                    fontSize: "14px",
                    background: "#fff",
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseOver={(e) => {
                    e.target.style.border = "1px solid #3b82f6";
                    e.target.style.background = "#dbeafe";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.border = "1px solid #e5e7eb";
                    e.target.style.background = "#fff";
                  }}
                >
                  <span style={{ color: "#4b5563" }}>{sample.title}</span>
                </button>
              ))}
            </div>
          </div>

          <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "24px" }}>
            <div style={{ position: "relative" }}>
              <textarea
                ref={textareaRef}
                value={userInput}
                onChange={handleTextareaInput}
                placeholder="Describe your legal issue, goals, and preferences..."
                style={{
                  width: "100%",
                  minHeight: "120px",
                  padding: "20px",
                  fontSize: "16px",
                  color: "#1f2937",
                  background: "#f9fafb",
                  border: "1px solid #e5e7eb",
                  borderRadius: "12px",
                  resize: "none",
                  outline: "none",
                  transition: "all 0.3s",
                }}
                onFocus={(e) => (e.target.style.border = "2px solid #3b82f6")}
                onBlur={(e) => (e.target.style.border = "1px solid #e5e7eb")}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleStrategySelect(tab.id)}
                  style={{
                    padding: "16px",
                    borderRadius: "12px",
                    border: `2px solid ${activeTab === tab.id ? tab.color : "#e5e7eb"}`,
                    background: activeTab === tab.id ? `${tab.color}20` : "#fff",
                    color: activeTab === tab.id ? tab.color : "#4b5563",
                    textAlign: "left",
                    transition: "all 0.3s",
                    cursor: "pointer",
                  }}
                  onMouseOver={(e) => {
                    if (activeTab !== tab.id) e.target.style.border = "2px solid #d1d5db";
                  }}
                  onMouseOut={(e) => {
                    if (activeTab !== tab.id) e.target.style.border = "2px solid #e5e7eb";
                  }}
                >
                  <div style={{ fontWeight: "600", fontSize: "16px" }}>{tab.label}</div>
                  <div style={{ fontSize: "14px", marginTop: "4px", opacity: "0.75" }}>
                    Timeline: {tab.timeline}
                  </div>
                </button>
              ))}
            </div>

            {activeTab && (
              <div
                style={{
                  padding: "24px",
                  background: "#fff",
                  borderRadius: "16px",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                  border: "1px solid #e5e7eb",
                }}
              >
                <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#111827", marginBottom: "8px" }}>
                  {tabs.find((tab) => tab.id === activeTab)?.label} Strategy
                </h2>
                <p style={{ color: "#6b7280" }}>{tabs.find((tab) => tab.id === activeTab)?.description}</p>
                <div style={{ marginTop: "16px" }}>
                  <p style={{ fontWeight: "500", color: "#1f2937" }}>Suggested Approaches:</p>
                  <ul style={{ listStyleType: "disc", paddingLeft: "20px", color: "#6b7280" }}>
                    {tabs.find((tab) => tab.id === activeTab)?.suggestedApproaches.map((approach, index) => (
                      <li key={index}>{approach}</li>
                    ))}
                  </ul>
                </div>
                <div style={{ marginTop: "16px" }}>
                  <p style={{ fontWeight: "500", color: "#1f2937" }}>Suitability:</p>
                  <p style={{ color: "#6b7280" }}>{tabs.find((tab) => tab.id === activeTab)?.suitability}</p>
                </div>
              </div>
            )}
          </div>

          <div
            style={{
              padding: "24px",
              background: "linear-gradient(to bottom right, #e5e7eb, #d1d5db)",
              borderTop: "1px solid #e5e7eb",
            }}
          >
            <button
              onClick={handleGenerate}
              disabled={!activeTab || !userInput || isGenerating}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                padding: "16px 32px",
                borderRadius: "12px",
                fontSize: "18px",
                fontWeight: "500",
                background: activeTab && userInput && !isGenerating ? "linear-gradient(to top right, #3b82f6, #1e40af)" : "#f3f4f6",
                color: activeTab && userInput && !isGenerating ? "#fff" : "#9ca3af",
                cursor: activeTab && userInput && !isGenerating ? "pointer" : "not-allowed",
                transition: "all 0.3s",
              }}
              onMouseOver={(e) => {
                if (activeTab && userInput && !isGenerating) e.target.style.background = "linear-gradient(to top right, #60a5fa, #3b82f6)";
              }}
              onMouseOut={(e) => {
                if (activeTab && userInput && !isGenerating) e.target.style.background = "linear-gradient(to top right, #3b82f6, #1e40af)";
              }}
            >
              <Send style={{ width: "24px", height: "24px" }} />
              <span>{isGenerating ? "Analyzing Your Case..." : "Generate Legal Pathway"}</span>
            </button>
          </div>
        </div>

        {isGenerating && (
          <div
            style={{
              background: "#fff",
              borderRadius: "16px",
              boxShadow: "0 10px 15px rgba(0,0,0,0.1)",
              padding: "40px",
              textAlign: "center",
              maxWidth: "512px",
              margin: "0 auto",
            }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                border: "4px solid #3b82f6",
                borderTop: "4px solid transparent",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                margin: "0 auto",
              }}
            ></div>
            <h3 style={{ marginTop: "24px", fontSize: "20px", fontWeight: "600", color: "#111827" }}>
              Creating Your Personalized Legal Pathway
            </h3>
            <p style={{ marginTop: "12px", color: "#6b7280" }}>
              Analyzing your preferences and generating the optimal legal strategy...
            </p>
          </div>
        )}

        {showFlowchart && serverData && (
          <div ref={flowchartRef} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div style={{ background: "#fff", borderRadius: "16px", boxShadow: "0 10px 15px rgba(0,0,0,0.1)", overflow: "hidden" }}>
              <div style={{ height: "700px", width: "100%", background: "linear-gradient(to bottom right, #f3f4f6, #e5e7eb)" }}>
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onConnect={onConnect}
                  fitView
                  style={{ background: "#f9fafb" }}
                  defaultEdgeOptions={{ type: "smoothstep", animated: true, style: { strokeWidth: 2 } }}
                >
                  <Background color={theme === "dark" ? "#444" : "#eee"} gap={16} />
                  <Controls />
                </ReactFlow>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default LegalPathFlow;