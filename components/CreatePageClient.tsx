'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { FileUploaderRegular } from "@uploadcare/react-uploader";
import "@uploadcare/react-uploader/core.css";
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import { FaRegTrashAlt } from "react-icons/fa";
import { BiSolidHide } from "react-icons/bi";
import { MdSwitchLeft } from "react-icons/md";
import { IoAdd } from "react-icons/io5";

// Define Face type
interface Face {
    faceIndex: number;
    faceUrl: string;
}

const HARDCODED_TEMPLATES: { url: string; value: string }[] = [
    { url: "/france.jpeg", value: "france" },
    { url: "/vikings.jpeg", value: "vikings" },
    { url: "/cowboys.jpeg", value: "cowboys" },
    { url: "/knights.jpeg", value: "knights" },
    { url: "/samurai.jpeg", value: "samurai" },
    { url: "/bond.jpeg", value: "vikings" },
    { url: "/firemen.jpeg", value: "vikingsn" },
    { url: "/hippies.jpeg", value: "vikings" },
    { url: "/mages.jpeg", value: "vikings" },
    { url: "/ninjas.jpeg", value: "vikings" },
    { url: "/spartans.jpeg", value: "vikings" },
    { url: "/vikings.jpeg", value: "vikings" }
];

const PILL_OPTIONS = ['All', 'Vikings', 'Cowboys', 'Samurai', 'Knights', 'Cool', 'Beans', 'Another One', 'Christmas', 'Easter', 'Family', 'More Option', 'Option 2', 'Halloween', 'Wow Option'];

export default function CreatePage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const supabase = createPagesBrowserClient();

    const [step, setStep] = useState<number>(1);
    useEffect(() => {
        const updateStepFromUrl = () => {
            const url = new URL(window.location.href);
            const stepParam = url.searchParams.get('step');
            const stepValue = stepParam ? parseInt(stepParam) : 1;
            setStep(stepValue);
        };
        
        // Initial load
        updateStepFromUrl();
        
        // Listen to back/forward browser buttons
        window.addEventListener('popstate', updateStepFromUrl);
        
        return () => {
            window.removeEventListener('popstate', updateStepFromUrl);
        };
    }, []);

    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
    const [faces, setFaces] = useState<Face[]>([]);
    const [compositeImageUrl, setCompositeImageUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isSwapping, setIsSwapping] = useState(false);
    const [loading, setLoading] = useState(false);
    const [uploadBtn, setUploadBtn] = useState(true);

    useEffect(() => {
        const fetchFaces = async () => {
            try {

                await supabase.auth.refreshSession();

                const {
                    data: { session },
                } = await supabase.auth.getSession();
    
                const response = await fetch('/api/images/get-user-faces', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${session?.access_token}`
                    }
                });
    
                const data = await response.json();
                if(data.cleanFaces && data.cleanFaces.length > 0) {
                    setUploadBtn(false);
                }

                setFaces(data.cleanFaces);
            } catch (err) {
                console.error("Error fetching faces:", err);
            }
        };

        fetchFaces();
     }, []);

    const scrollRef = useRef<HTMLDivElement | null>(null);

    const scrollLeft = () => {
    if (scrollRef.current) {
        scrollRef.current.scrollBy({ left: -150, behavior: 'smooth' });
    }
    };

    const scrollRight = () => {
    if (scrollRef.current) {
        scrollRef.current.scrollBy({ left: 150, behavior: 'smooth' });
    }
    };

    const [selectedPill, setSelectedPill] = useState('All');
    const filteredTemplates = HARDCODED_TEMPLATES.filter(t =>
        selectedPill === 'All' ? true : t.value.toLowerCase() === selectedPill.toLowerCase()
    );

    const goToStep = (stepNumber: number) => {
        const url = new URL(window.location.href);
        url.searchParams.set('step', stepNumber.toString());
        router.push(url.toString()); // or replace
        setStep(stepNumber);
    };

    // Handle template selection
    const handleSelectTemplate = (value: string) => {
        setSelectedTemplate(value);
        goToStep(2);
    };

    // Handle image upload & face detection
    const handleFileUpload = async (file: { cdnUrl: string }) => {
        setIsUploading(true);
        const fileUrl = file.cdnUrl;
        const uuidMatch = fileUrl.match(/https:\/\/ucarecdn.com\/(.+?)\//);
        const uuid = uuidMatch ? uuidMatch[1] : null;
        if (!uuid) return;

        try {
            setLoading(true);
            setUploadBtn(false);
            const timestamp = new Date().toISOString();

            await supabase.auth.refreshSession();
            
            const {
                data: { session },
            } = await supabase.auth.getSession();

            const response = await fetch('/api/images/detect-faces', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session?.access_token}`
                },
                body: JSON.stringify({ imageUuid: uuid, group: timestamp })
            });

            const data = await response.json();
            if (data.faces) {
                setFaces(prevFaces => [...prevFaces, ...data.faces]);
                // setFaces(data.faces);
                setStep(2); // Move to next step after detection
                setLoading(false);
                setUploadBtn(false);
            }
        } catch (error) {
            console.error('Error fetching faces:', error);
        } finally {
            setIsUploading(false);
        }
    };

    // Swap faces API call
    const handleFaceSwap = async () => {
        if (faces.length === 0 || !selectedTemplate) return;

        try {
            setLoading(true);

            await supabase.auth.refreshSession();
            
            const {
                data: { session },
            } = await supabase.auth.getSession();

            const response = await fetch('/api/images/create-job', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session?.access_token}`
                },
                body: JSON.stringify(
                    { 
                        faceObjs: faces,
                        templateId: '0887f11d-ef32-4e58-b557-2e9fed260333',
                        type: 'single'
                    }
                )
            });

            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error('Error fetching faces:', error);
        } finally {
            setLoading(false);
        }

        /*
        setIsSwapping(true);

        try {
            setLoading(true);
            const response = await fetch('/api/images/face-swap', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ faces: faces.map(face => face.faceUrl), selectedOption: selectedTemplate })
            });

            const data = await response.json();
            if (data.compositeImageUrl) {
                setCompositeImageUrl(data.compositeImageUrl);
                setStep(3); // Move to final step
                setLoading(false);
            }
        } catch (error) {
            console.error('Error swapping faces:', error);
        } finally {
            setIsSwapping(false);
        }
        */
    };

    // Remove a face from the list
    const handleRemoveFace = async (faceIndex: number) => {
        try {
            setLoading(true);
            const timestamp = new Date().toISOString();

            await supabase.auth.refreshSession();

            const {
                data: { session },
            } = await supabase.auth.getSession();

            const response = await fetch('/api/images/delete-user-face', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session?.access_token}`
                },
                body: JSON.stringify({ faceRowId: faceIndex })
            });

            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error('Error fetching faces:', error);
        } finally {
            setFaces(prevFaces => prevFaces.filter(face => face.faceIndex !== faceIndex));
        }
    };

    const handleHideFace = (faceIndex: number) => {
        setFaces(prevFaces => prevFaces.filter(face => face.faceIndex !== faceIndex));
    }

    // Swap places between two faces
    const handleSwitchPlaces = (index1: number, index2: number) => {
        setFaces(prevFaces => {
            const newFaces = [...prevFaces];
            [newFaces[index1], newFaces[index2]] = [newFaces[index2], newFaces[index1]];
            return newFaces;
        });
    };

    // Reset everything for "Try Again"
    const handleReset = () => {
        router.push('/create'); // no query param
        setStep(1);
        setSelectedTemplate(null);
        setCompositeImageUrl(null);
        setSelectedPill('All');
        setUploadBtn(false);
    };

    const handleClearFaces = () => {
        setFaces([]);
        setUploadBtn(true);
    };

    const handleAddNewFaces = () => {
        setUploadBtn(true);
    };

    const handleChangeTemplate = () => {
        router.push('/create'); // no query param
        setStep(1);
    };

    const goToProfile = async () => {
        router.push('/profile')
    }

    return (
        <div className="flex flex-col h-screen">

            {/* Fixed Header */}
            <div
                className="fixed top-2 left-4 cursor-pointer z-10"
                onClick={handleReset}
            >
                <Image 
                    src="/glogo.png"
                    alt="Group Swap"
                    className="text-center cursor-pointer"
                    width={58}
                    height={44}
                /> 
            </div>
            <div 
                onClick={goToProfile}
                className="fixed top-5 right-4 text-white text-sm cursor-pointer z-10">
                    🖼 Profile
            </div>
            <header className="fixed top-0 w-full bg-gray-800 text-white py-4 text-center text-xl font-bold">
                {step === 1 && "Select a Template"}
                {step === 2 && faces && faces.length === 0 && "Add Group Photo"}
                {step === 2 && faces && faces.length > 0 && "Set Faces"}
                {step === 3 && "Done"}
            </header>

            {step === 1 && (
            <div className="fixed w-full z-30 bg-white border-t border-gray-200 md:border-b flex items-center px-2 py-4 bottom-0 md:top-14 md:bottom-auto">

                {/* Left arrow (only visible on md and up) */}
                <button
                onClick={scrollLeft}
                className="hidden md:inline-block px-2 text-gray-500 hover:text-gray-700"
                >
                ◀
                </button>

                {/* Scrollable pills container */}
                <div
                ref={scrollRef}
                className="flex-1 overflow-x-auto whitespace-nowrap scroll-smooth flex gap-2 px-2 md:px-4 scrollbar-none"
                >
                {PILL_OPTIONS.map(option => (
                    <button
                    key={option}
                    onClick={() => setSelectedPill(option)}
                    className={`px-4 py-1 rounded-full text-sm font-medium border shrink-0 ${
                        selectedPill === option
                        ? 'bg-primary text-white border-primary'
                        : 'bg-gray-100 text-gray-700 border-gray-300'
                    }`}
                    >
                    {option}
                    </button>
                ))}
                </div>

                {/* Right arrow (only visible on md and up) */}
                <button
                onClick={scrollRight}
                className="hidden md:inline-block px-2 text-gray-500 hover:text-gray-700"
                >
                ▶
                </button>
            </div>
            )}

            {/* Content Area - Scrollable when needed */}
            <div className="flex-grow pt-16 pb-20 overflow-hidden">
                
                {/* Step 1: Template Selection with Bento Grid */}
                {step === 1 && (
                    <div className="flex flex-col items-center h-full overflow-y-auto p-4 md:mt-14">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {filteredTemplates.map(({ url, value }, index) => (
                            <div key={index} className="cursor-pointer" onClick={() => handleSelectTemplate(value)}>
                            <Image src={url} alt={`Template ${index}`} width={200} height={200} />
                            </div>
                        ))}
                        </div>
                    </div>
                )}

                {/* Step 2: Upload & Arrange Faces */}
                {step === 2 && (
                    <div className="flex flex-col items-center h-full overflow-y-auto px-4">

                        {(faces.length === 0 || uploadBtn) && (
                            <div>
                                <div className="w-full flex justify-center mb-2 mt-2">
                                    <div className="w-auto max-w-sm">
                                        <FileUploaderRegular 
                                            pubkey="44255e8ed4e36d259969"
                                            data-images-only
                                            multiple={false}
                                            onFileUploadSuccess={handleFileUpload}
                                            className="fileUploaderWrapper"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {faces.length > 0 && (
                            <div className="mt-2">
                                <div className="flex gap-4 justify-center mb-3">
                                    <button onClick={() => handleAddNewFaces()} className="px-4 py-2 bg-blue-500 text-white text-xs rounded mt-1 mb-1 flex">
                                        <IoAdd className="h-full"/>
                                        <span className="ml-1">Add New Faces</span>
                                    </button>
                                    <button onClick={() => handleClearFaces()} className="px-4 py-2 bg-yellow-500 text-white text-xs rounded mt-1 mb-1 flex">
                                        <BiSolidHide className="h-full"/>
                                        <span className="ml-1">Hide All Faces</span>
                                    </button>
                                </div>
                                <div className="grid grid-cols-4 gap-2 md:gap-4">
                                    {faces.map(({ faceIndex, faceUrl }, index) => (
                                        <div key={faceIndex} className="flex flex-col items-center text-center">

                                            <div className="w-full">
                                                <button onClick={() => handleRemoveFace(faceIndex)} className="w-full py-1 bg-red-500 text-white text-sm flex items-center justify-center">
                                                    <FaRegTrashAlt />
                                                </button>
                                            </div>

                                            <Image src={faceUrl} alt={`Face ${faceIndex}`} width={100} height={100} className="w-auto h-auto" />

                                            <div className="grid grid-cols-2 w-full">
                                                <div className="grid-cols-1">
                                                    <button onClick={() => handleHideFace(faceIndex)} className="w-full py-2 bg-yellow-500 text-white text-sm flex items-center justify-center">
                                                        <BiSolidHide />
                                                    </button>
                                                </div>
                                                <div className="grid-cols-1">
                                                    {index < faces.length - 1 && (
                                                        <button onClick={() => handleSwitchPlaces(index, index + 1)} className="w-full py-2 bg-blue-500 text-white text-sm flex items-center justify-center">
                                                            <MdSwitchLeft />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {selectedTemplate && (
                            <div className="mt-2 grid grid-cols-1 justify-items-center">
                                <Image 
                                    src={HARDCODED_TEMPLATES.find(t => t.value === selectedTemplate)?.url || ""} 
                                    alt="Selected Template" 
                                    width={200} 
                                    height={200} 
                                    className="w-auto h-auto border rounded mb-1" 
                                />
                                <button onClick={() => handleChangeTemplate()} className="px-4 py-2 bg-blue-500 text-white text-xs rounded mt-1 mb-1">🔁 Change Template</button>
                            </div>
                        )}

                        {!selectedTemplate && (
                            <div className="mt-2 grid grid-cols-1 justify-items-center">
                                <button onClick={() => handleChangeTemplate()} className="px-4 py-2 bg-blue-500 text-white text-xs rounded mt-1 mb-1">*️⃣ Select Template</button>
                            </div>
                        )}

                    </div>
                )}

                {/* Step 3: Composite Image */}
                {step === 3 && compositeImageUrl && (
                    <div className="flex flex-col items-center justify-center h-full">
                        <Image src={compositeImageUrl} alt="Composite" width={1000} height={1000} className="w-auto h-auto" />
                    </div>
                )}
            </div>

            {/* Fixed Footer with Action Buttons */}
            <footer className="fixed bottom-0 w-full bg-gray-900 text-white py-4 flex justify-center gap-4">
                {step === 2 && faces.length > 0 && selectedTemplate && (
                    <button 
                        onClick={handleFaceSwap} 
                        disabled={isSwapping} 
                        className="px-24 py-3 bg-primary hover:bg-primary-dark rounded">
                        {isSwapping ? "Swapping..." : "Swap Faces"}
                    </button>
                )}
                {step === 3 && (
                    <>
                        <a href={compositeImageUrl ?? "#"} target="_blank" className="px-12 py-3 bg-green-600 text-white rounded">Download</a>
                        <button onClick={handleReset} className="px-12 py-3 bg-primary hover:bg-primary-dark text-white rounded">Try Again</button>
                    </>
                )}
            </footer>

        </div>
    );
}
