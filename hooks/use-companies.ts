"use client"

import { useState, useEffect } from "react"

export interface Company {
  id: string
  name: string
  toneOfVoice: {
    coreStatement: string
    empathisch: string
    dos: string
  }
}

export function useCompanies() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null)

  // Load companies from localStorage on mount
  useEffect(() => {
    const storedCompanies = localStorage.getItem("companies")
    if (storedCompanies) {
      const parsedCompanies = JSON.parse(storedCompanies)
      setCompanies(parsedCompanies)
      if (parsedCompanies.length > 0) {
        setSelectedCompanyId(parsedCompanies[0].id)
      }
    }
  }, [])

  // Save companies to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("companies", JSON.stringify(companies))
  }, [companies])

  const addCompany = (name: string) => {
    const newCompany: Company = {
      id: crypto.randomUUID(),
      name,
      toneOfVoice: {
        coreStatement: "",
        empathisch: "",
        dos: "",
      },
    }
    setCompanies([...companies, newCompany])
    setSelectedCompanyId(newCompany.id)
  }

  const updateCompanyToneOfVoice = (companyId: string, toneOfVoice: Company["toneOfVoice"]) => {
    setCompanies(companies.map((company) => (company.id === companyId ? { ...company, toneOfVoice } : company)))
  }

  const selectedCompany = companies.find((c) => c.id === selectedCompanyId)

  return {
    companies,
    selectedCompany,
    setSelectedCompanyId,
    addCompany,
    updateCompanyToneOfVoice,
  }
}

