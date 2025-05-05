export default function ClientFooter() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4 px-6">
            <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    &copy; {currentYear} 리뷰어 체험단. All rights reserved.
                </div>

                <div className="flex mt-2 md:mt-0 space-x-4">
                    <a
                        href="#"
                        className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                        이용약관
                    </a>
                    <a
                        href="#"
                        className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                        개인정보처리방침
                    </a>
                    <a
                        href="#"
                        className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                        고객센터
                    </a>
                </div>
            </div>
        </footer>
    );
}