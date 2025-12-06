import React from 'react';
import { Author } from '../../types';
import Card from '../ui/Card';
import { Link } from 'react-router-dom';

interface AuthorCardProps {
    author: Author;
}

const AuthorCard: React.FC<AuthorCardProps> = ({ author }) => {
    return (
        <Link to={`/publishing/authors/${author.id}`}>
            <Card className="p-6 text-center" onClick={() => {}}>
                <img src={author.avatar} alt={author.name} className="w-32 h-32 rounded-full mx-auto border-4 border-dark-border" />
                <h3 className="text-xl font-bold text-white mt-4">{author.name}</h3>
                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-dark-bg p-2 rounded-lg">
                        <p className="text-gray-400">Books Published</p>
                        <p className="font-semibold text-white">{author.booksPublished}</p>
                    </div>
                    <div className="bg-dark-bg p-2 rounded-lg">
                        <p className="text-gray-400">Total Sales</p>
                        <p className="font-semibold text-white">{author.totalSales.toLocaleString()}</p>
                    </div>
                </div>
            </Card>
        </Link>
    );
};

export default AuthorCard;
