import styles from './IntegrationComment.module.scss';

export const IntegrationComment: React.FC = () => {
    return (
        <div className={styles.wrp}>
            <p className={styles.username}>Username: </p>
            <p className={styles.commentText}>Comments text positive or negative</p>

            <div className={styles.thumbs}>
                <button className={styles.thumbsUp}/>
                <button className={styles.thumbsDown}/>
            </div>
        </div>
    )
}