import { useState } from 'react';
import { Check, CircleCheck, CircleX, Pencil, Plus, Trash2, Undo2, X } from 'lucide-react';

export interface OptionItem {
    name: string;
    isWished: boolean;
    isPhotoRequired: boolean;
    reviewType: '텍스트리뷰' | '포토리뷰';
    deliveryType: '실배송' | '빈박스';
    recruitCount: number;
    point: number;
}

interface EditableOptionItem extends OptionItem {
    isDeleted?: boolean;
}

function OptionRow({ option, onDelete }: { option: OptionItem; onDelete?: () => void }) {
    return (
        <tr className="hover:bg-gray-50 border-b">
            <td className="px-4 py-3 text-left">{option.name}</td>
            <td className="px-4 py-3 text-left">{option.point}P</td>
            <td className="px-4 py-3 text-center">
                {option.isWished ? <CircleCheck size={16} className="text-green-600" /> : <CircleX size={16} className="text-red-600" />}
            </td>
            <td className="px-4 py-3 text-center">
                {option.isPhotoRequired ? <CircleCheck size={16} className="text-green-600" /> : <CircleX size={16} className="text-red-600" />}
            </td>
            <td className="px-4 py-3 text-left">{option.reviewType}</td>
            <td className="px-4 py-3 text-left">{option.deliveryType}</td>
            <td className="px-4 py-3 text-center">{option.recruitCount}명</td>
            <td className="px-4 py-3 text-right space-x-2">
                {onDelete && (
                    <button onClick={onDelete} className="text-gray-500 hover:text-red-600">
                        <Trash2 size={16} />
                    </button>
                )}
            </td>
        </tr>
    );
}

function OptionInputRow({
                            option,
                            onChange,
                            onCancel,
                            className = "bg-gray-50",
                            isDeleted = false,
                            onRestore,
                        }: {
    option: OptionItem;
    onChange: (opt: OptionItem) => void;
    onCancel: () => void;
    className?: string;
    isDeleted?: boolean;
    onRestore?: () => void;
}) {
    return (
        <tr className={`${className} border-b ${isDeleted ? 'line-through text-gray-400 opacity-60' : ''}`}>
            <td className="px-4 py-3 text-left">
                <input disabled={isDeleted} type="text" value={option.name} onChange={(e) => onChange({ ...option, name: e.target.value })} className="w-full border border-gray-300 rounded px-2 py-1 text-sm" placeholder="옵션명 입력" />
            </td>
            <td className="px-4 py-3 text-left">
                <input disabled={isDeleted} type="text" value={option.point} onChange={(e) => onChange({ ...option, name: e.target.value })} className="w-full border border-gray-300 rounded px-2 py-1 text-sm" placeholder="0"/>
            </td>
            <td className="px-4 py-3 text-left">
                <input type="checkbox" disabled={isDeleted} checked={option.isWished} onChange={(e) => onChange({ ...option, isWished: e.target.checked })} />
            </td>
            <td className="px-4 py-3 text-left">
                <input type="checkbox" disabled={isDeleted} checked={option.isPhotoRequired} onChange={(e) => onChange({ ...option, isPhotoRequired: e.target.checked })} />
            </td>
            <td className="px-4 py-3 text-left">
                <select disabled={isDeleted} value={option.reviewType} onChange={(e) => onChange({ ...option, reviewType: e.target.value as OptionItem['reviewType'] })} className="w-full border border-gray-300 rounded px-2 py-1 text-sm">
                    <option value="텍스트리뷰">텍스트리뷰</option>
                    <option value="포토리뷰">포토리뷰</option>
                </select>
            </td>
            <td className="px-4 py-3 text-left">
                <select disabled={isDeleted} value={option.deliveryType} onChange={(e) => onChange({ ...option, deliveryType: e.target.value as OptionItem['deliveryType'] })} className="w-full border border-gray-300 rounded px-2 py-1 text-sm">
                    <option value="실배송">실배송</option>
                    <option value="빈박스">빈박스</option>
                </select>
            </td>
            <td className="px-4 py-3 text-center">
                <input type="number" disabled={isDeleted} min={0} value={option.recruitCount} onChange={(e) => onChange({ ...option, recruitCount: parseInt(e.target.value, 10) || 0 })} className="w-20 border border-gray-300 rounded px-2 py-1 text-sm text-right" />
            </td>
            <td className="px-4 py-3 text-right space-x-2">
                {isDeleted ? (
                    <button onClick={onRestore} className="text-blue-500 hover:text-blue-700"><Undo2 size={16} /></button>
                ) : (
                    <button onClick={onCancel} className="text-red-600 hover:text-red-800"><X size={16} /></button>
                )}
            </td>
        </tr>
    );
}

function OptionEditRow({
                           option,
                           onChange,
                           onMarkDelete,
                           onRestore,
                       }: {
    option: EditableOptionItem;
    onChange: (opt: EditableOptionItem) => void;
    onMarkDelete: () => void;
    onRestore: () => void;
}) {
    return (
        <OptionInputRow
            option={option}
            onChange={onChange}
            onCancel={onMarkDelete}
            onRestore={onRestore}
            className="bg-blue-50"
            isDeleted={option.isDeleted}
        />
    );
}

export default function OptionTable({ initialOptions }: { initialOptions: OptionItem[] }) {
    const [optionList, setOptionList] = useState<OptionItem[]>(initialOptions);
    const [addingRows, setAddingRows] = useState<OptionItem[]>([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editedOptions, setEditedOptions] = useState<EditableOptionItem[]>([]);

    const addNewRow = () => {
        if (!isEditMode) return;
        setAddingRows([...addingRows, { name: '', isWished: false, isPhotoRequired: false, reviewType: '텍스트리뷰', deliveryType: '실배송', recruitCount: 0 }]);
    };

    const updateNewRow = (index: number, newOption: OptionItem) => {
        const updated = [...addingRows];
        updated[index] = newOption;
        setAddingRows(updated);
    };


    const cancelNewRow = (index: number) => {
        setAddingRows(addingRows.filter((_, i) => i !== index));
    };

    const toggleEditMode = () => {
        setIsEditMode(!isEditMode);
        setEditedOptions(optionList.map(o => ({ ...o })));
        setAddingRows([]); // 신규행도 초기화
    };

    const updateEditedRow = (index: number, updated: EditableOptionItem) => {
        const copy = [...editedOptions];
        copy[index] = updated;
        setEditedOptions(copy);
    };

    const markOptionAsDeleted = (index: number) => {
        const copy = [...editedOptions];
        copy[index] = { ...copy[index], isDeleted: true };
        setEditedOptions(copy);
    };

    const restoreDeletedOption = (index: number) => {
        const copy = [...editedOptions];
        copy[index] = { ...copy[index], isDeleted: false };
        setEditedOptions(copy);
    };

    const saveAllEdits = () => {
        const filtered = editedOptions.filter(o => !o.isDeleted);
        const all = [...optionList, ...addingRows]; // 원래 옵션 + 신규행
        setOptionList([...filtered, ...addingRows]); // isDeleted 처리 + 신규행 반영
        setEditedOptions([]);
        setAddingRows([]);
        setIsEditMode(false);
    };

    const cancelEdit = () => {
        setIsEditMode(false);
        setEditedOptions([]);
        setAddingRows([]); // 신규 행도 제거
    };

    return (
        <section className="mt-6">
            {/*<div className="flex justify-end gap-2 mb-2">
                {isEditMode && (
                    <button
                        onClick={addNewRow}
                        className="p-2 border border-gray-300 rounded-md hover:bg-gray-100"
                        aria-label="옵션 추가"
                    >
                        <Plus size={16} className="text-gray-600" />
                    </button>
                )}
                <button onClick={toggleEditMode} className="p-2 border border-gray-300 rounded-md hover:bg-gray-100" aria-label="수정 모드">
                    <Pencil size={16} className="text-gray-600" />
                </button>
                {isEditMode && (
                    <>
                        <button onClick={saveAllEdits} className="p-2 border border-green-500 rounded-md hover:bg-green-100" aria-label="저장">
                            <Check size={16} className="text-green-600" />
                        </button>
                        <button onClick={cancelEdit} className="p-2 border border-red-400 rounded-md hover:bg-red-100" aria-label="취소">
                            <X size={16} className="text-red-600" />
                        </button>
                    </>
                )}
            </div>*/}

            <div className="rounded-xl overflow-hidden border border-gray-200">
                <div className="max-h-[250px] overflow-y-auto">
                    <table className="w-full table-fixed text-sm text-gray-900 border-collapse">
                        <thead className="bg-gray-100 text-xs font-semibold text-gray-600 sticky top-0 z-10">
                        <tr className="border-b">
                            <th className="px-4 py-2 text-left w-[30%]">옵션명</th>
                            <th className="px-4 py-2 text-left w-[8rem]">포인트</th>
                            <th className="px-4 py-2 text-left w-[6rem]">찜</th>
                            <th className="px-4 py-2 text-left w-[6rem]">포토</th>
                            <th className="px-4 py-2 text-left w-[8rem]">리뷰 타입</th>
                            <th className="px-4 py-2 text-left w-[8rem]">배송 형태</th>
                            <th className="px-4 py-2 text-center w-[6rem]">인원</th>
                            <th className="px-4 py-2 text-center w-[10rem]">
                                <div className="flex justify-end gap-2">
                                    {isEditMode ? (
                                        <>
                                            <button
                                                onClick={addNewRow}
                                                className="p-1 border border-gray-300 rounded-md hover:bg-gray-100"
                                                aria-label="옵션 추가"
                                            >
                                                <Plus size={14} className="text-gray-600" />
                                            </button>
                                            <button
                                                onClick={saveAllEdits}
                                                className="p-1 border border-green-500 rounded-md hover:bg-green-100"
                                                aria-label="저장"
                                            >
                                                <Check size={14} className="text-green-600" />
                                            </button>
                                            <button
                                                onClick={cancelEdit}
                                                className="p-1 border border-red-400 rounded-md hover:bg-red-100"
                                                aria-label="취소"
                                            >
                                                <X size={14} className="text-red-600" />
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={toggleEditMode}
                                            className="p-1 border border-gray-300 rounded-md hover:bg-gray-100"
                                            aria-label="수정 모드"
                                        >
                                            <Pencil size={14} className="text-gray-600" />
                                        </button>
                                    )}
                                </div>
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {!isEditMode
                            ? optionList.map((opt, idx) => (
                                <OptionRow key={`view-${idx}`} option={opt} />
                            ))
                            : editedOptions.map((opt, idx) => (
                                <OptionEditRow
                                    key={`edit-${idx}`}
                                    option={opt}
                                    onChange={(updated) => updateEditedRow(idx, updated)}
                                    onMarkDelete={() => markOptionAsDeleted(idx)}
                                    onRestore={() => restoreDeletedOption(idx)}
                                />
                            ))}

                        {addingRows.map((row, idx) => (
                            <OptionInputRow
                                key={`new-${idx}`}
                                option={row}
                                onChange={(updated) => updateNewRow(idx, updated)}
                                onCancel={() => cancelNewRow(idx)}
                                className="bg-yellow-50"
                            />
                        ))}

                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}
