import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import Tools from './pages/Tools'
import Compress from './pages/tools/Compress'
import MergePdf from './pages/tools/MergePdf'
import SplitPdf from './pages/tools/SplitPdf'
import ImgToPdf from './pages/tools/ImgToPdf'
import BgRemove from './pages/tools/BgRemove'
import QrTools from './pages/tools/QrTools'
import Resume from './pages/tools/Resume'
import PdfEditor from './pages/tools/PdfEditor'
import DocxToPdf from './pages/tools/DocxToPdf'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tools" element={<Tools />} />
        <Route path="/tools/compress" element={<Compress />} />
        <Route path="/tools/pdf-editor" element={<PdfEditor />} />
        <Route path="/tools/merge" element={<MergePdf />} />
        <Route path="/tools/split" element={<SplitPdf />} />
        <Route path="/tools/img-to-pdf" element={<ImgToPdf />} />
        <Route path="/tools/docx-to-pdf" element={<DocxToPdf />} />
        <Route path="/tools/bg-remove" element={<BgRemove />} />
        <Route path="/tools/qr" element={<QrTools />} />
        <Route path="/tools/resume" element={<Resume />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}