import React, { useState, useEffect } from 'react';
import fonts from './fonts.json'; 
import { Fonts } from './type'; 
import './texteditor.css';

const TextEditor: React.FC = () => {
  // Load font data from JSON
  const fontData: Fonts = fonts;

  // State hooks for managing text and font properties
  const [text, setText] = useState<string>('');
  const [fontFamily, setFontFamily] = useState<string>('ABeeZee');
  const [fontWeight, setFontWeight] = useState<string>('400');
  const [isItalic, setIsItalic] = useState<boolean>(false);

  // Load saved settings from localStorage when the component mounts
  useEffect(() => {
    const savedText = localStorage.getItem('text');
    const savedFontFamily = localStorage.getItem('fontFamily');
    const savedFontWeight = localStorage.getItem('fontWeight');
    const savedIsItalic = localStorage.getItem('isItalic') === 'true';

    if (savedText) setText(savedText);
    if (savedFontFamily) setFontFamily(savedFontFamily);
    if (savedFontWeight) setFontWeight(savedFontWeight);
    if (savedIsItalic) setIsItalic(savedIsItalic);
  }, []);

  // Save current settings to localStorage whenever they change
useEffect(() => {
    localStorage.setItem('text', text);
    localStorage.setItem('fontFamily', fontFamily);
    localStorage.setItem('fontWeight', fontWeight);
    localStorage.setItem('isItalic', isItalic.toString());
  }, [text, fontFamily, fontWeight, isItalic]);

  // Update the link element to load the selected font style
useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = fontData[fontFamily][`${fontWeight}${isItalic ? 'italic' : ''}`];
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, [fontFamily, fontWeight, isItalic]);

  // Handle font family change
const handleFontFamilyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedFont = event.target.value;
    const variants = Object.keys(fontData[selectedFont]);
    const closestVariant = findClosestVariant(variants, fontWeight, isItalic);

    setFontFamily(selectedFont);
    setFontWeight(closestVariant.weight);
    setIsItalic(closestVariant.italic);
  };

  // Handle font weight change
const handleFontWeightChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const weight = event.target.value;
    setFontWeight(weight);
    const variants = Object.keys(fontData[fontFamily]);
    setIsItalic(variants.includes(`${weight}italic`));
  };

  // Handle italic toggle select change
const handleItalicChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const italic = event.target.value === 'italic';
    setIsItalic(italic);
    const variants = Object.keys(fontData[fontFamily]);
    if (!variants.includes(`${fontWeight}italic`) && italic) {
        setIsItalic(false); // Revert back if italic is not available for the selected weight
    }
  };

  // Find the closest font variant based on weight and italic status
  const findClosestVariant = (variants: string[], weight: string, italic: boolean) => {
    const hasItalic = variants.includes(`${weight}italic`);
    
    if (italic && hasItalic) {
        return { weight, italic: true };
    }

    if (italic) {
        const closestItalic = variants.find(variant => variant.includes('italic'));
        if (closestItalic) {
            return { weight: closestItalic.replace('italic', ''), italic: true };
        }
    }

    const availableWeights = variants
        .filter(variant => !variant.includes('italic'))
        .map(variant => parseInt(variant, 10));
    const currentWeight = parseInt(weight, 10);
    const closestWeight = findClosestWeight(availableWeights, currentWeight);
    return { weight: closestWeight.toString(), italic: false };
  };

  // Find the closest weight to the target weight
  const findClosestWeight = (weights: number[], targetWeight: number) => {
    if (weights.length === 0) return 400; // Default weight if no weights available
    return weights.reduce((prev, curr) =>
        Math.abs(curr - targetWeight) < Math.abs(prev - targetWeight) ? curr : prev
    );
  };

  // Prepare options for select elements
  const fontOptions = Object.keys(fontData).map((font) => ({
    value: font,
    label: font,
  }));
const weightOptions = Object.keys(fontData[fontFamily])
      .filter((variant) => !variant.includes('italic'))
      .map((variant) => ({
          value: variant,
          label: variant,
      }));
  const italicOptions = [
      { value: 'italic', label: 'Italic' },
      { value: 'normal', label: 'Normal' },
  ];

  return (
    <div className="text-editor-container">
        <div className='Header'>
            <h1
                className="text-editor-header"
                style={{ fontFamily, fontWeight, fontStyle: isItalic ? 'italic' : 'normal' }}
            >
                Text Editor
            </h1>
        </div>
        <div className="text-editor-fonts">
            <div>
                <label>
                    Font Family
                    <select value={fontFamily} onChange={handleFontFamilyChange} className="custom-select">
                        {fontOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </label>
            </div>
            <div>
                <label>
                    Font Weight
                    <select value={fontWeight} onChange={handleFontWeightChange} className="custom-select">
                        {weightOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </label>
            </div>
            <div>
                <label>
                    Italic
                    <select value={isItalic ? 'italic' : 'normal'} onChange={handleItalicChange} className="custom-select">
                        {italicOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </label>
            </div>
        </div>
        <div className='textarea'>
            <textarea
                className="text-editor-textarea"
                style={{ fontFamily, fontWeight, fontStyle: isItalic ? 'italic' : 'normal' }}
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
        </div>
    </div>
  );
};

export default TextEditor;
