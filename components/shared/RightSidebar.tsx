const RightSidebar = (): React.JSX.Element => {
    return (
        <aside className="custom-scrollbar rightsidebar">
            <div className="flex flex-1 flex-col justify-start">
                <h3 className="text-heading4-medium text-light-1">Suggested Communities</h3>
            </div>
            <div className="flex flex-1 flex-col justify-start">
                <h3 className="text-heading4-medium text-light-1">Suggested Users</h3>
            </div>
        </aside>
    );
};

export default RightSidebar;
