import { NextRequest, NextResponse } from 'next/server'
import jsPDF from 'jspdf'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { answers, multiSelectAnswers = [], visaType, results } = body

    if (!answers || !Array.isArray(answers) || !results) {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 })
    }

    // Create new PDF document
    const doc = new jsPDF()
    
    // Set font
    doc.setFont('helvetica')
    
    // Colors
    const primaryColor = [59, 130, 246] // Blue
    const secondaryColor = [107, 114, 128] // Gray
    const successColor = [34, 197, 94] // Green
    const warningColor = [245, 158, 11] // Yellow
    const dangerColor = [239, 68, 68] // Red

    let yPosition = 20
    const pageWidth = doc.internal.pageSize.getWidth()
    const margin = 20
    const contentWidth = pageWidth - (margin * 2)

    // Header
    doc.setFontSize(24)
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
    doc.text('Visa Assessment Report', margin, yPosition)
    yPosition += 15

    // Visa Type and Date
    doc.setFontSize(12)
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])
    doc.text(`Visa Type: ${visaType.charAt(0).toUpperCase() + visaType.slice(1)}`, margin, yPosition)
    doc.text(`Assessment Date: ${new Date().toLocaleDateString()}`, margin + 80, yPosition)
    yPosition += 20

    // Results Summary
    doc.setFontSize(16)
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
    doc.text('Assessment Results', margin, yPosition)
    yPosition += 15

    // Score and Percentage (only for visit visa)
    if (visaType === 'visit' && results.score !== undefined && results.maxScore !== undefined) {
      doc.setFontSize(14)
      doc.setTextColor(0, 0, 0)
      doc.text(`Total Score: ${results.score}/${results.maxScore}`, margin, yPosition)
      doc.text(`Percentage: ${results.scorePercentage}%`, margin + 80, yPosition)
      yPosition += 10

      // Approval Chance
      const approvalChanceColor = results.scorePercentage >= 70 ? successColor : 
                                 results.scorePercentage >= 50 ? warningColor : dangerColor
      doc.setTextColor(approvalChanceColor[0], approvalChanceColor[1], approvalChanceColor[2])
      doc.setFontSize(12)
      const approvalChance = results.scorePercentage >= 70 ? 'Strong Application' :
                            results.scorePercentage >= 50 ? 'Moderate Application' :
                            'Needs Improvement'
      doc.text(`Application Strength: ${approvalChance}`, margin, yPosition)
      yPosition += 20
    } else {
      // For study visa, just add some spacing
      yPosition += 5
    }

    // Check if we need a new page
    if (yPosition > 250) {
      doc.addPage()
      yPosition = 20
    }

    // Detailed Responses
    doc.setFontSize(16)
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
    doc.text('Detailed Responses', margin, yPosition)
    yPosition += 15

    // Loop through answers
    type Answer = {
      questionText: string
      selectedOption: string
      points?: number | null
    }

    type MultiSelectAnswer = {
      questionText: string
      selectedOptions: Array<{
        optionText: string
        points?: number | null
      }>
    }
    
    let questionNumber = 1
    
    // Single-select answers
    answers.forEach((answer: Answer) => {
      // Check if we need a new page
      if (yPosition > 250) {
        doc.addPage()
        yPosition = 20
      }

      // Question number and text
      doc.setFontSize(12)
      doc.setTextColor(0, 0, 0)
      doc.setFont('helvetica', 'bold')
      
      // Split long questions into multiple lines
      const questionText = `${questionNumber}. ${answer.questionText}`
      const splitQuestion = doc.splitTextToSize(questionText, contentWidth)
      doc.text(splitQuestion, margin, yPosition)
      yPosition += (splitQuestion.length * 6) + 3

      // Selected option
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])
      doc.text(`Selected: ${answer.selectedOption}`, margin + 10, yPosition)
      yPosition += 8

      // Points earned (only for visit visa and if points exist)
      if (visaType === 'visit' && answer.points !== null && answer.points !== undefined) {
        doc.setTextColor(successColor[0], successColor[1], successColor[2])
        doc.text(`Points: ${answer.points}`, margin + 10, yPosition)
        yPosition += 10
      }
      
      yPosition += 5
      questionNumber++
    })

    // Multi-select answers
    multiSelectAnswers.forEach((answer: MultiSelectAnswer) => {
      // Check if we need a new page
      if (yPosition > 250) {
        doc.addPage()
        yPosition = 20
      }

      // Question number and text
      doc.setFontSize(12)
      doc.setTextColor(0, 0, 0)
      doc.setFont('helvetica', 'bold')
      
      const questionText = `${questionNumber}. ${answer.questionText}`
      const splitQuestion = doc.splitTextToSize(questionText, contentWidth)
      doc.text(splitQuestion, margin, yPosition)
      yPosition += (splitQuestion.length * 6) + 3

      // Selected options
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])
      doc.text('Selected:', margin + 10, yPosition)
      yPosition += 6

      let totalPoints = 0
      answer.selectedOptions.forEach((option, idx) => {
        doc.text(`  • ${option.optionText}`, margin + 15, yPosition)
        yPosition += 6
        
        if (visaType === 'visit' && option.points !== null && option.points !== undefined) {
          totalPoints += option.points
        }
      })

      // Total points for multi-select (only for visit visa)
      if (visaType === 'visit' && totalPoints > 0) {
        doc.setTextColor(successColor[0], successColor[1], successColor[2])
        doc.text(`Total Points: ${totalPoints}`, margin + 10, yPosition)
        yPosition += 10
      }
      
      yPosition += 5
      questionNumber++
    })

    // Check if we need a new page for recommendations
    if (yPosition > 200) {
      doc.addPage()
      yPosition = 20
    }

    // Recommendations Section
    if (results.recommendations && results.recommendations.length > 0) {
      doc.setFontSize(16)
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
      doc.text('Recommendations', margin, yPosition)
      yPosition += 15

      type Recommendation = {
        title: string
        description: string
      }
      
      results.recommendations.forEach((rec: Recommendation, index: number) => {
        // Check if we need a new page
        if (yPosition > 250) {
          doc.addPage()
          yPosition = 20
        }

        doc.setFontSize(12)
        doc.setTextColor(0, 0, 0)
        doc.setFont('helvetica', 'bold')
        doc.text(`${index + 1}. ${rec.title}`, margin, yPosition)
        yPosition += 8

        doc.setFont('helvetica', 'normal')
        doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])
        const splitDescription = doc.splitTextToSize(rec.description, contentWidth)
        doc.text(splitDescription, margin + 10, yPosition)
        yPosition += (splitDescription.length * 6) + 10
      })
    }

    // Footer
    const pageCount = doc.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(10)
      doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])
      doc.text(`Page ${i} of ${pageCount}`, pageWidth - 30, doc.internal.pageSize.getHeight() - 10)
      doc.text('Generated by Travelovers Visa Assessment', margin, doc.internal.pageSize.getHeight() - 10)
    }

    // Generate PDF buffer
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'))

    // Return PDF as response
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Application Strength Test.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    })

  } catch (error) {
    console.error('Error generating PDF:', error)
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 })
  }
}
