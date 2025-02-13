"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useState, useEffect } from "react"
import { useCompanies } from "@/contexts/CompaniesContext"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { useToast } from "@/components/ui/use-toast"


export function MainContent() {
  const { selectedCompany, updateCompanyToneOfVoice } = useCompanies()
  const [inputText, setInputText] = useState("")
  const [outputText, setOutputText] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [editedToneOfVoice, setEditedToneOfVoice] = useState(selectedCompany?.toneOfVoice || "")
  const [isTranslating, setIsTranslating] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    setEditedToneOfVoice(selectedCompany?.toneOfVoice || "")
  }, [selectedCompany])

  const handleSave = () => {
    if (selectedCompany) {
      updateCompanyToneOfVoice(selectedCompany.id, editedToneOfVoice)
      setIsEditing(false)
      toast({
        title: "Tone of voice opgeslagen",
        description: "De wijzigingen zijn succesvol opgeslagen.",
      })
    }
  }

  const handleTranslate = async () => {
    if (!selectedCompany?.toneOfVoice) {
      toast({
        title: "Geen tone of voice beschikbaar",
        description: "Voeg eerst een tone of voice toe aan dit bedrijf.",
        variant: "destructive",
      })
      return
    }

    if (!inputText.trim()) {
      toast({
        title: "Geen tekst om te vertalen",
        description: "Voer eerst een tekst in om te vertalen.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsTranslating(true)
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentText: inputText,
          toneOfVoice: selectedCompany.toneOfVoice,
        }),
      })

      const data = await response.json()
      console.log("API response:", data) // Log the parsed response

      if (!response.ok) {
        console.error("Response not OK:", response.status, response.statusText)
        throw new Error(data.error || "Er is iets misgegaan bij het vertalen.")
      }

      if (!data.translatedText) {
        console.error("No translated text in response:", data)
        throw new Error("Geen vertaling ontvangen van de server.")
      }

      setOutputText(data.translatedText)
      toast({
        title: "Tekst vertaald",
        description: "De tekst is succesvol aangepast volgens de tone of voice.",
      })
    } catch (error) {
      console.error("Translation error:", error)
      toast({
        title: "Fout bij vertalen",
        description: error instanceof Error ? error.message : "Er is iets misgegaan bij het vertalen van de tekst.",
        variant: "destructive",
      })
      setOutputText("") // Clear output on error
    } finally {
      setIsTranslating(false)
    }
  }

  if (!selectedCompany) {
    return (
      <main className="flex-1 p-8">
        <p className="text-muted-foreground">Selecteer een bedrijf of voeg een nieuw bedrijf toe.</p>
      </main>
    )
  }

  return (
    <main className="flex-1 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{selectedCompany.name}</h1>
        <Button
          variant="outline"
          onClick={() => {
            if (isEditing) {
              handleSave()
            } else {
              setIsEditing(true)
            }
          }}
        >
          {isEditing ? "Opslaan" : "Bewerken"}
        </Button>
      </div>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Tone of voice</h2>
        <Card>
          <CardContent className="p-6">
            {isEditing ? (
              <Textarea
                value={editedToneOfVoice}
                onChange={(e) => setEditedToneOfVoice(e.target.value)}
                className="min-h-[300px] font-mono"
                placeholder="Voer hier de tone of voice in met markdown..."
              />
            ) : (
              <div className="prose dark:prose-invert max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {selectedCompany.toneOfVoice || "*Geen tone of voice ingesteld*"}
                </ReactMarkdown>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Vertalen</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Textarea
              placeholder="Voer hier uw tekst in..."
              className="min-h-[200px]"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
          </div>
          <div>
            <Textarea
              placeholder="Vertaalde tekst verschijnt hier..."
              className="min-h-[200px]"
              value={outputText}
              readOnly
            />
          </div>
        </div>
        <div className="flex justify-center mt-4">
          <Button onClick={handleTranslate} className="px-8" disabled={isTranslating}>
            {isTranslating ? "Bezig met vertalen..." : "vertaal"}
          </Button>
        </div>
      </section>
    </main>
  )
}

