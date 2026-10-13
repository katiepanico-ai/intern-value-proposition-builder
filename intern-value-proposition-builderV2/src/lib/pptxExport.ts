import PptxGenJS from 'pptxgenjs'
import type { AppData } from '../types'
import { lciPriorities } from '../config/lciPriorities'
import { computeImpact } from './metrics'
import { valueLenses } from '../config/projectTypes'

const DELL_BLUE = '0076CE'
const DARK_GRAY = '444444'
const WHITE = 'FFFFFF'
const LIGHT_GRAY = 'F5F5F5'

function titleBar(slide: PptxGenJS.Slide, title: string) {
  slide.addShape('rect', { x: 0, y: 0, w: '100%', h: 0.9, fill: { color: DELL_BLUE } })
  slide.addText(title, {
    x: 0.5, y: 0, w: 9, h: 0.9,
    fontFace: 'Calibri', fontSize: 24, bold: true, color: WHITE, valign: 'middle',
  })
}

function bodyBg(slide: PptxGenJS.Slide) {
  slide.background = { color: WHITE }
}

export async function exportToPptx(data: AppData): Promise<void> {
  const pptx = new PptxGenJS()
  pptx.defineLayout({ name: 'WIDE', width: 10, height: 5.63 })
  pptx.layout = 'WIDE'

  const projectTitle = data.step1.projectTitle || 'Internship Project'
  const internName = data.internInfo.name || 'Intern'
  const dateStr = new Date().toISOString().slice(0, 10)

  // ---------- Slide 1: Title ----------
  const s1 = pptx.addSlide()
  s1.background = { color: DELL_BLUE }
  s1.addText(projectTitle, {
    x: 0.6, y: 1.7, w: 8.8, h: 1.6, align: 'center', valign: 'middle',
    fontFace: 'Calibri', fontSize: 36, bold: true, color: WHITE,
  })
  s1.addText('Internship Project Value Proposition', {
    x: 0.6, y: 3.2, w: 8.8, h: 0.5, align: 'center',
    fontFace: 'Calibri', fontSize: 16, color: WHITE,
  })
  const metaParts = [internName, data.internInfo.team, dateStr].filter(Boolean)
  s1.addText(metaParts.join('  |  '), {
    x: 0.6, y: 3.8, w: 8.8, h: 0.4, align: 'center',
    fontFace: 'Calibri', fontSize: 13, color: WHITE,
  })

  // ---------- Slide 2: Project Overview ----------
  const s2 = pptx.addSlide()
  bodyBg(s2)
  titleBar(s2, 'Project Overview')
  s2.addText('Description', { x: 0.5, y: 1.15, w: 9, h: 0.35, fontFace: 'Calibri', fontSize: 15, bold: true, color: DELL_BLUE })
  s2.addText(data.step1.description || 'Not provided.', { x: 0.5, y: 1.55, w: 9, h: 1.2, fontFace: 'Calibri', fontSize: 13, color: DARK_GRAY })
  s2.addText('Stakeholder / End User', { x: 0.5, y: 2.85, w: 4.3, h: 0.35, fontFace: 'Calibri', fontSize: 15, bold: true, color: DELL_BLUE })
  s2.addText(data.step1.stakeholder || 'Not provided.', { x: 0.5, y: 3.25, w: 4.3, h: 1.1, fontFace: 'Calibri', fontSize: 13, color: DARK_GRAY })
  s2.addText('Key Outcome', { x: 5.1, y: 2.85, w: 4.4, h: 0.35, fontFace: 'Calibri', fontSize: 15, bold: true, color: DELL_BLUE })
  s2.addText(data.step1.keyOutcome || 'Not provided.', { x: 5.1, y: 3.25, w: 4.4, h: 1.1, fontFace: 'Calibri', fontSize: 13, color: DARK_GRAY })

  // ---------- Slide 3: Business Alignment ----------
  const s3 = pptx.addSlide()
  bodyBg(s3)
  titleBar(s3, 'Strategic Alignment')
  const priorityNames = data.step2.selectedPriorities.map((id) => {
    if (id === 'other') return data.step2.customPriority || 'Other'
    return lciPriorities.find((p) => p.id === id)?.name || id
  })
  let badgeX = 0.5
  const badgeY = 1.2
  priorityNames.forEach((name) => {
    const w = Math.min(4.5, 0.35 + name.length * 0.09)
    s3.addShape('roundRect', { x: badgeX, y: badgeY, w, h: 0.45, fill: { color: LIGHT_GRAY }, line: { color: DELL_BLUE, width: 1 }, rectRadius: 0.08 })
    s3.addText(name, { x: badgeX, y: badgeY, w, h: 0.45, align: 'center', valign: 'middle', fontFace: 'Calibri', fontSize: 11, bold: true, color: DELL_BLUE })
    badgeX += w + 0.2
    if (badgeX > 8.5) { badgeX = 0.5 }
  })
  s3.addText('Articulation', { x: 0.5, y: 2.0, w: 9, h: 0.35, fontFace: 'Calibri', fontSize: 15, bold: true, color: DELL_BLUE })
  s3.addText(data.step2.articulation || 'Not provided.', { x: 0.5, y: 2.4, w: 9, h: 2.5, fontFace: 'Calibri', fontSize: 14, color: DARK_GRAY, valign: 'top' })

  // ---------- Slide 4: Value and ROI ----------
  // Three layouts depending on what the intern filled in: numbers only,
  // value descriptions only (common for research / AI / testing work), or both.
  const s4 = pptx.addSlide()
  bodyBg(s4)
  const isExpected = data.step3.impactStage === 'expected'
  titleBar(s4, isExpected ? 'Expected Impact and Value' : 'Impact and ROI')
  const validMetrics = data.step3.metrics.filter((m) => m.before !== '' && m.after !== '')
  const lensItems = valueLenses
    .map((l) => ({ label: l.deckLabel, text: (data.step3.valueLenses[l.id] || '').trim() }))
    .filter((l) => l.text !== '')
  if (data.step3.qualitativeImpact.trim()) lensItems.push({ label: 'Other Impact', text: data.step3.qualitativeImpact.trim() })
  const impactStatement = data.step3.impactStatement || 'Not provided.'

  const lensRuns = (fontSize: number): PptxGenJS.TextProps[] =>
    lensItems.flatMap((l, i) => [
      { text: `${l.label}: `, options: { bold: true, color: DELL_BLUE, fontSize, breakLine: false } },
      { text: l.text, options: { color: DARK_GRAY, fontSize, breakLine: i < lensItems.length - 1, paraSpaceAfter: 6 } },
    ])
  const lensChars = lensItems.reduce((n, l) => n + l.label.length + l.text.length, 0)

  if (validMetrics.length > 0) {
    const compact = lensItems.length > 0
    const rowH = compact ? 0.32 : 0.4
    const header = (text: string): PptxGenJS.TableCell => ({ text, options: { bold: true, color: WHITE, fill: { color: DELL_BLUE } } })
    const rows: PptxGenJS.TableRow[] = [[header('Metric'), header('Before'), header('After'), header('Impact')]]
    validMetrics.forEach((m) => {
      const impact = computeImpact(m)
      rows.push([
        { text: impact.metricLabel },
        { text: `${m.before} ${m.unit}` },
        { text: `${m.after} ${m.unit}` },
        { text: impact.label + (m.isEstimate ? ' (est.)' : '') },
      ])
    })
    const tableY = compact ? 1.1 : 1.15
    s4.addTable(rows, { x: 0.5, y: tableY, w: 9, colW: [2.5, 2, 2, 2.5], rowH, fontFace: 'Calibri', fontSize: compact ? 10 : 11, border: { type: 'solid', color: 'DDDDDD' } })
    const belowY = tableY + rowH * (validMetrics.length + 1) + 0.2
    if (!compact) {
      s4.addText('Impact Statement', { x: 0.5, y: belowY, w: 9, h: 0.35, fontFace: 'Calibri', fontSize: 15, bold: true, color: DELL_BLUE })
      s4.addText(impactStatement, { x: 0.5, y: belowY + 0.4, w: 9, h: 1.3, fontFace: 'Calibri', fontSize: 13, color: DARK_GRAY, valign: 'top' })
    } else {
      const h = 5.45 - belowY - 0.35
      s4.addText('Impact Statement', { x: 0.5, y: belowY, w: 4.3, h: 0.3, fontFace: 'Calibri', fontSize: 13, bold: true, color: DELL_BLUE })
      s4.addText(impactStatement, { x: 0.5, y: belowY + 0.35, w: 4.3, h, fontFace: 'Calibri', fontSize: 11, color: DARK_GRAY, valign: 'top' })
      s4.addText('Additional Value', { x: 5.1, y: belowY, w: 4.4, h: 0.3, fontFace: 'Calibri', fontSize: 13, bold: true, color: DELL_BLUE })
      s4.addText(lensRuns(lensChars > 450 ? 9 : 10), { x: 5.1, y: belowY + 0.35, w: 4.4, h, fontFace: 'Calibri', valign: 'top' })
    }
  } else if (lensItems.length > 0) {
    const fontSize = lensChars > 750 ? 11 : lensChars > 450 ? 12 : 13
    s4.addText(lensRuns(fontSize), { x: 0.5, y: 1.1, w: 9, h: 2.75, fontFace: 'Calibri', valign: 'top' })
    s4.addShape('rect', { x: 0.5, y: 3.95, w: 9, h: 1.4, fill: { color: LIGHT_GRAY }, line: { color: DELL_BLUE, width: 1 } })
    s4.addText('Impact Statement', { x: 0.7, y: 4.0, w: 8.6, h: 0.3, fontFace: 'Calibri', fontSize: 13, bold: true, color: DELL_BLUE })
    s4.addText(impactStatement, { x: 0.7, y: 4.3, w: 8.6, h: 1.0, fontFace: 'Calibri', fontSize: 12, color: DARK_GRAY, valign: 'top' })
  } else {
    s4.addText('Impact Statement', { x: 0.5, y: 1.2, w: 9, h: 0.35, fontFace: 'Calibri', fontSize: 15, bold: true, color: DELL_BLUE })
    s4.addText(impactStatement, { x: 0.5, y: 1.6, w: 9, h: 1.5, fontFace: 'Calibri', fontSize: 14, color: DARK_GRAY, valign: 'top' })
  }

  // ---------- Slide 5: Scalability and Automation ----------
  const s5 = pptx.addSlide()
  bodyBg(s5)
  titleBar(s5, 'Scalability and Automation Potential')
  s5.addText('Scalability', { x: 0.5, y: 1.15, w: 4.3, h: 0.35, fontFace: 'Calibri', fontSize: 15, bold: true, color: DELL_BLUE })
  const scaleText = data.step4.scaleWhere.trim() || data.step4.scaleChecklist.filter((i) => i !== 'Other (specify)').join('; ')
  s5.addText(scaleText || 'Not provided.', { x: 0.5, y: 1.55, w: 4.3, h: 2.2, fontFace: 'Calibri', fontSize: 12, color: DARK_GRAY })
  s5.addShape('line', { x: 5.0, y: 1.15, w: 0, h: 2.7, line: { color: 'DDDDDD', width: 1 } })
  s5.addText('Automation', { x: 5.2, y: 1.15, w: 4.3, h: 0.35, fontFace: 'Calibri', fontSize: 15, bold: true, color: DELL_BLUE })
  s5.addText(data.step4.automationDetails || 'Not provided.', { x: 5.2, y: 1.55, w: 4.3, h: 2.2, fontFace: 'Calibri', fontSize: 12, color: DARK_GRAY })
  s5.addText('Resources Needed', { x: 0.5, y: 3.95, w: 9, h: 0.3, fontFace: 'Calibri', fontSize: 13, bold: true, color: DELL_BLUE })
  s5.addText(data.step4.resourcesNeeded || 'Not provided.', { x: 0.5, y: 4.25, w: 9, h: 0.9, fontFace: 'Calibri', fontSize: 11, color: DARK_GRAY })

  // ---------- Slide 6: Recommendation and Next Steps ----------
  const s6 = pptx.addSlide()
  bodyBg(s6)
  titleBar(s6, 'Recommendation and Next Steps')
  s6.addText('Recommendation', { x: 0.5, y: 1.1, w: 9, h: 0.3, fontFace: 'Calibri', fontSize: 14, bold: true, color: DELL_BLUE })
  s6.addText(data.step5.recommendation || 'Not provided.', { x: 0.5, y: 1.4, w: 9, h: 0.9, fontFace: 'Calibri', fontSize: 12, color: DARK_GRAY })
  s6.addText(data.step5.ownershipUndecided ? 'Proposed Ownership (to be confirmed)' : 'Ownership', { x: 0.5, y: 2.35, w: 9, h: 0.3, fontFace: 'Calibri', fontSize: 14, bold: true, color: DELL_BLUE })
  s6.addText(data.step5.ownership || 'Not provided.', { x: 0.5, y: 2.65, w: 9, h: 0.9, fontFace: 'Calibri', fontSize: 12, color: DARK_GRAY })
  s6.addShape('roundRect', { x: 0.5, y: 3.75, w: 9, h: 1.4, fill: { color: DELL_BLUE }, rectRadius: 0.08 })
  s6.addText(data.step5.closingStatement || 'Not provided.', {
    x: 0.8, y: 3.75, w: 8.4, h: 1.4, valign: 'middle', align: 'center',
    fontFace: 'Calibri', fontSize: 16, bold: true, color: WHITE,
  })

  const safeName = (internName || 'Intern').replace(/[^a-z0-9]+/gi, '_')
  const fileName = `${safeName}_Value_Proposition_${dateStr}.pptx`
  await pptx.writeFile({ fileName })
}
