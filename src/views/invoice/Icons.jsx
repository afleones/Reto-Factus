// src/views/invoice/Icons.jsx
// src/views/invoice/Icons.jsx
import {
  Clock,
  Search,
  ChevronDown,
  Send,
  FileText,
  Download,
  Eye,
  File,
  X,
  Check
} from 'lucide-react';
import { FaFilePdf } from "react-icons/fa6";
import { BsFiletypeXml } from "react-icons/bs";

// Exportamos los componentes con nombres que terminan en "Icon" para mantener consistencia
export const ClockIcon = Clock;
export const SearchIcon = Search;
export const ChevronDownIcon = ChevronDown;
export const SendIcon = Send;
export const FileTextIcon = FileText;
export const DownloadIcon = Download;
export const EyeIcon = Eye;
export const FileIcon = File;
export const XIcon = X;
export const CheckIcon = Check;
export const PdfIcon = FaFilePdf;
export const XmlIcon = BsFiletypeXml;

export function MoreVerticalIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
      />
    </svg>
  )
}

